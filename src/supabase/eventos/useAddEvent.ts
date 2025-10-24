import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatDateForDb, formatTimeForDb } from "../date/FormatarData";

//tipos que o hook vai usar
export type NewEventPayload = {
  titulo: string;
  categoria?: string | null;
  data: string; // formata a data no formato ano/mês/dia
  horario?: string | null; // formato de horas e minutos
  local: string;
  capacidade: number;
};

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

function makeRandomId() {
  try {
    return (crypto as any).randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

function getExtensionFromFile(file: File) {
  const nm = file.name ?? "";
  const segs = nm.split(".");
  if (segs.length > 1) {
    return segs[segs.length - 1].toLowerCase();
  }
  // fallback para o mime
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg" || file.type === "image/jpg") return "jpg";
  return "jpg";
}

//hook criar evento
export function useAddEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  // fallback increment 
  const incrementEventosCriadosFallback = async (ownerId: string) => {
    console.debug("[useAddEvent][fallback] incrementEventosCriadosFallback start for", ownerId);
    const { data: userRow, error: selErr } = await supabase
      .from("usuarios")
      .select("eventos_criados")
      .eq("id", ownerId)
      .maybeSingle();

    if (selErr) {
      console.warn("[useAddEvent][fallback] selErr:", selErr);
      throw selErr;
    }

    const current = Number(userRow?.eventos_criados ?? 0);
    const next = Math.max(0, current + 1);

    const { error: updErr } = await supabase
      .from("usuarios")
      .update({ eventos_criados: next })
      .eq("id", ownerId);

    if (updErr) {
      console.warn("[useAddEvent][fallback] updErr:", updErr);
      throw updErr;
    }
    console.debug("[useAddEvent][fallback] increment done, next:", next);
  };

  const callIncrementRpc = async (ownerId: string) => {
    console.debug("[useAddEvent] calling RPC increment_eventos_criados for", ownerId);
    try {
      const { error: rpcErr } = await supabase.rpc("increment_eventos_criados", { uid: ownerId } as any);
      if (rpcErr) {
        console.warn("[useAddEvent] rpcErr:", rpcErr);
        throw rpcErr;
      }
      console.debug("[useAddEvent] rpc increment succeeded for", ownerId);
    } catch (err) {
      console.warn("[useAddEvent] callIncrementRpc catch:", err);
      throw err;
    }
  };

  const addEventForUser = useCallback(
    async (ownerId: string | null, evento: NewEventPayload, imageFile?: File | null) => {
      if (!ownerId) throw new Error("Usuário não autenticado.");

      setLoading(true);
      setError(null);
      setEventId(null);

      try {
        // validação básica
        const capacidadeValida = Math.max(1, Number(evento.capacidade ?? 1));

        // formata a data para yyyy-mm-dd, usnado o hook de ho´rario
        const formattedDate = formatDateForDb(evento.data);
        if (!formattedDate) throw new Error("Data do evento inválida.");

        // normaliza horario, baguho pode ser null
        const formattedTime = formatTimeForDb(evento.horario ?? null);

        // valida titulo
        if (!evento.titulo || !String(evento.titulo).trim()) {
          throw new Error("Título do evento obrigatório.");
        }

        const eventRow: any = {
          usuario_id: ownerId,
          titulo: (evento.titulo ?? "").trim(),
          categoria: evento.categoria ?? null,
          data_evento: formattedDate,
          horario: formattedTime,
          local: evento.local ?? "",
          capacidade_max: capacidadeValida,
          participantes_atual: 0,
          imagem_url: null,
        };
        // dubug: antes de inserir
        console.debug("[useAddEvent] criando evento, ownerId:", ownerId, "payload:", {
          ...eventRow,
          imagem_url: Boolean(imageFile),
        });

        // envia o evento e gera o id também
        const { data: insertedEvents, error: insertErr } = await supabase
          .from("eventos")
          .insert([eventRow])
          .select("id")
          .maybeSingle();

        // DEBUG: ver o retorno do insert
        console.debug("[useAddEvent] insert result:", { insertedEvents, insertErr });

        if (insertErr) {
          console.warn("[useAddEvent] insertErr:", insertErr);
          throw insertErr;
        }
        if (!insertedEvents || !insertedEvents.id) {
          console.warn("[useAddEvent] insertedEvents ausente ou sem id:", insertedEvents);
          throw new Error("Falha ao criar evento (id ausente).");
        }

        const newEventId = String(insertedEvents.id);
        setEventId(newEventId);
        console.debug("[useAddEvent] evento criado com id:", newEventId);

        let imagePath: string | null = null;
        if (imageFile) {
          //validar tipo da imagem
          if (!imageFile.type || !ALLOWED_MIMES.includes(imageFile.type.toLowerCase())) {
            console.warn("[useAddEvent] mime inválido:", imageFile.type);
            // limpa dos eventos da linha da tabela do supabase
            try { await supabase.from("eventos").delete().eq("id", newEventId); } catch (e) { console.warn("[useAddEvent] falha rollback delete (mime inválido):", e); }
            throw new Error("Tipo de arquivo inválido. Apenas JPG/PNG são permitidos.");
          }
          if (imageFile.size > MAX_FILE_BYTES) {
            console.warn("[useAddEvent] arquivo > MAX_FILE_BYTES:", imageFile.size);
            try { await supabase.from("eventos").delete().eq("id", newEventId); } catch (e) { console.warn("[useAddEvent] falha rollback delete (tamanho):", e); }
            throw new Error("Arquivo muito grande. Máx 5MB.");
          }

          const timestamp = Date.now();
          const ext = getExtensionFromFile(imageFile);
          const random = makeRandomId();
          const path = `events/${newEventId}/cover/${timestamp}_${random}.${ext}`;

          // DEBUG: antes do upload
          console.debug("[useAddEvent] fazendo upload para path:", path, "fileSize:", imageFile.size, "ext:", ext);

          // upload da imagem
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("public-images")
            .upload(path, imageFile, { cacheControl: "public, max-age=31536000, immutable", upsert: false });

          console.debug("[useAddEvent] upload result:", { uploadData, uploadError });

          if (uploadError) {
            console.warn("[useAddEvent] uploadError:", uploadError);
            // evento de rollback
            try {
              await supabase.from("eventos").delete().eq("id", newEventId);
              console.debug("[useAddEvent] rollback: evento deletado após uploadError");
            } catch (e) {
              console.warn("[useAddEvent] Não foi possível remover evento após falha de upload:", e);
            }
            throw uploadError;
          }

          imagePath = path;

          // criar o evento com o path da imagem
          const { error: updErr } = await supabase.from("eventos").update({ imagem_url: imagePath }).eq("id", newEventId);
          if (updErr) {
            console.warn("[useAddEvent] updErr ao setar imagem_url:", updErr);
            // tenta limpar remove o upload
            try { await supabase.storage.from("public-images").remove([path]); console.debug("[useAddEvent] removeu arquivo em storage por falha updErr"); } catch (remErr) { console.warn("[useAddEvent] falha ao remover arquivo do storage:", remErr); }
            try { await supabase.from("eventos").delete().eq("id", newEventId); console.debug("[useAddEvent] removeu evento por falha updErr"); } catch (delErr) { console.warn("[useAddEvent] falha ao deletar evento por updErr:", delErr); }
            throw updErr;
          }
          console.debug("[useAddEvent] imagem enviada e imagem_url atualizada:", imagePath);
        }

        // insere os participantes contando já com o criador do evento
        const participantRow = {
          evento_id: newEventId,
          usuario_id: ownerId,
          joined_at: new Date().toISOString(),
        };

        console.debug("[useAddEvent] inserindo participante:", participantRow);

        const { error: partErr } = await supabase.from("participantes").insert([participantRow]);

        if (partErr) {
          console.warn("[useAddEvent] partErr:", partErr);
          // função de limpar: remove o evento e o arquivo mandado se for do tipo any
          try { await supabase.from("eventos").delete().eq("id", newEventId); console.debug("[useAddEvent] rollback: evento deletado após partErr"); } catch (e) { console.warn("[useAddEvent] falha ao deletar evento depois de partErr:", e); }
          if (imagePath) {
            try { await supabase.storage.from("public-images").remove([imagePath]); console.debug("[useAddEvent] rollback: removeu imagem do storage após partErr"); } catch (e) { console.warn("[useAddEvent] falha ao remover imagem do storage apos partErr:", e); }
          }
          throw partErr;
        }
        console.debug("[useAddEvent] participante inserido com sucesso");

        // incrementa os eventos criados, util para mostrar isso no perfil do usuário depois
        try {
          await callIncrementRpc(ownerId);
        } catch (_rpcErr) {
          console.warn("[useAddEvent] rpc falhou, tentando fallback:", _rpcErr);
          try {
            await incrementEventosCriadosFallback(ownerId);
          } catch (fallbackErr) {
            console.warn("[useAddEvent] fallback também falhou:", fallbackErr);
          }
        }

        //qaundo termina o processo o hook define o loading como false para interromper o processo de carregamento e para de fazer os componentes esperarem
        setLoading(false);
        console.debug("[useAddEvent] addEventForUser finalizado com sucesso, newEventId:", newEventId);
        return newEventId;
      } catch (err: any) {
        // DEBUG e tratamento do erro final
        console.warn("[useAddEvent] erro geral:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
        throw err;
      } finally {
        // garante que o loading será sempre fechado, mesmo em caminhos inesperados
        setLoading(false);
      }
    },
    []
  );

  return { addEventForUser, loading, error, eventId };
}

export default useAddEvent;
