import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatDateForDb, formatTimeForDb } from "../date/FormatarData";

export type NewEventPayload = {
  titulo: string;
  categoria?: string | null;
  data: string;
  horario?: string | null;
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
  if (segs.length > 1) return segs[segs.length - 1].toLowerCase();
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg" || file.type === "image/jpg") return "jpg";
  return "jpg";
}

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
    async (ownerIdParam: string | null, evento: NewEventPayload, imageFile?: File | null) => {
      // resolve sessão e ownerId
      const userRes = await (supabase.auth as any).getUser?.();
      const authUid = userRes?.data?.user?.id ?? null;
      if (!authUid && !ownerIdParam) throw new Error("Usuário não autenticado.");
      const ownerId = authUid ?? ownerIdParam!;

      // helper: garante row do perfil existe (usa upsert para evitar race)
      async function ensureUserRowExists(ownerIdToEnsure: string) {
        const { data: existingUser, error: selErr } = await supabase
          .from("usuarios")
          .select("id, email")
          .eq("id", ownerIdToEnsure)
          .maybeSingle();

        if (selErr) throw selErr;
        if (existingUser) return;

        const sess = await (supabase.auth as any).getUser?.();
        const authUser = sess?.data?.user ?? null;
        const nome = authUser?.user_metadata?.full_name ?? authUser?.user_metadata?.name ?? (authUser?.email?.split?.("@")?.[0]) ?? "Usuário";
        const email = authUser?.email ?? null;
        const foto = authUser?.user_metadata?.avatar_url ?? authUser?.user_metadata?.picture ?? null;

        const insertObj: any = {
          id: ownerIdToEnsure,
          nome,
          email,
          bio: "Sou novato gente!",
          foto_url: foto,
          criado_em: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabase
          .from("usuarios")
          .upsert([insertObj], { onConflict: "id" });

        if (upsertErr) {
          console.warn("[ensureUserRowExists] upsertErr:", upsertErr);
          throw upsertErr;
        }
      }

      setLoading(true);
      setError(null);
      setEventId(null);

      try {
        // validações
        const capacidadeValida = Math.max(1, Number(evento.capacidade ?? 1));
        const formattedDate = formatDateForDb(evento.data);
        if (!formattedDate) throw new Error("Data do evento inválida.");
        const formattedTime = formatTimeForDb(evento.horario ?? null);
        if (!evento.titulo || !String(evento.titulo).trim()) throw new Error("Título do evento obrigatório.");

        // garante o perfil antes do insert (protege FK)
        await ensureUserRowExists(ownerId);

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

        console.debug("[useAddEvent] criando evento, ownerId:", ownerId, "payload:", { ...eventRow, imagem_url: Boolean(imageFile) });

        // insere evento
        const { data: insertedEvents, error: insertErr } = await supabase
          .from("eventos")
          .insert([eventRow])
          .select("id")
          .maybeSingle();

        console.debug("[useAddEvent] insert result:", { insertedEvents, insertErr });

        if (insertErr) {
          console.warn("[useAddEvent] insertErr:", insertErr);
          throw insertErr;
        }
        if (!insertedEvents || !insertedEvents.id) throw new Error("Falha ao criar evento (id ausente).");

        const newEventId = String(insertedEvents.id);
        setEventId(newEventId);
        console.debug("[useAddEvent] evento criado com id:", newEventId);

        let imagePath: string | null = null;

        // upload (se houver)
        if (imageFile) {
          if (!imageFile.type || !ALLOWED_MIMES.includes(imageFile.type.toLowerCase())) {
            console.warn("[useAddEvent] mime inválido:", imageFile.type);
            try { await supabase.from("eventos").delete().eq("id", newEventId); } catch (e) { console.warn("[useAddEvent] rollback delete (mime inválido):", e); }
            throw new Error("Tipo de arquivo inválido. Apenas JPG/PNG são permitidos.");
          }
          if (imageFile.size > MAX_FILE_BYTES) {
            console.warn("[useAddEvent] arquivo > MAX_FILE_BYTES:", imageFile.size);
            try { await supabase.from("eventos").delete().eq("id", newEventId); } catch (e) { console.warn("[useAddEvent] rollback delete (tamanho):", e); }
            throw new Error("Arquivo muito grande. Máx 5MB.");
          }

          const timestamp = Date.now();
          const ext = getExtensionFromFile(imageFile);
          const random = makeRandomId();
          const path = `events/${newEventId}/cover/${timestamp}_${random}.${ext}`;

          console.debug("[useAddEvent] fazendo upload para path:", path, "fileSize:", imageFile.size, "ext:", ext);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("public-images")
            .upload(path, imageFile, { cacheControl: "public, max-age=31536000, immutable", upsert: false });

          console.debug("[useAddEvent] upload result:", { uploadData, uploadError });

          if (uploadError) {
            console.warn("[useAddEvent] uploadError:", uploadError);
            try { await supabase.from("eventos").delete().eq("id", newEventId); console.debug("[useAddEvent] rollback: evento deletado após uploadError"); } catch (e) { console.warn("[useAddEvent] rollback delete failed:", e); }
            throw uploadError;
          }

          imagePath = path;

          // atualiza imagem_url no evento
          const { error: updErr } = await supabase.from("eventos").update({ imagem_url: imagePath }).eq("id", newEventId);
          if (updErr) {
            console.warn("[useAddEvent] updErr ao setar imagem_url:", updErr);
            try { await supabase.storage.from("public-images").remove([path]); console.debug("[useAddEvent] removeu arquivo em storage por falha updErr"); } catch (remErr) { console.warn("[useAddEvent] falha ao remover arquivo do storage:", remErr); }
            try { await supabase.from("eventos").delete().eq("id", newEventId); console.debug("[useAddEvent] removeu evento por falha updErr"); } catch (delErr) { console.warn("[useAddEvent] falha ao deletar evento por updErr:", delErr); }
            throw updErr;
          }
          console.debug("[useAddEvent] imagem enviada e imagem_url atualizada:", imagePath);
        }

        // insere participante (criador)
        const participantRow = {
          evento_id: newEventId,
          usuario_id: ownerId,
          joined_at: new Date().toISOString(),
        };
        console.debug("[useAddEvent] inserindo participante:", participantRow);

        const { error: partErr } = await supabase.from("participantes").insert([participantRow]);

        if (partErr) {
          console.warn("[useAddEvent] partErr:", partErr);
          try { await supabase.from("eventos").delete().eq("id", newEventId); console.debug("[useAddEvent] rollback: evento deletado após partErr"); } catch (e) { console.warn("[useAddEvent] falha ao deletar evento depois de partErr:", e); }
          if (imagePath) {
            try { await supabase.storage.from("public-images").remove([imagePath]); console.debug("[useAddEvent] rollback: removeu imagem do storage após partErr"); } catch (e) { console.warn("[useAddEvent] falha ao remover imagem do storage apos partErr:", e); }
          }
          throw partErr;
        }
        console.debug("[useAddEvent] participante inserido com sucesso");

        // incrementa contador (rpc com fallback)
        try {
          await callIncrementRpc(ownerId);
        } catch (_rpcErr) {
          console.warn("[useAddEvent] rpc falhou, tentando fallback:", _rpcErr);
          try { await incrementEventosCriadosFallback(ownerId); } catch (fallbackErr) { console.warn("[useAddEvent] fallback também falhou:", fallbackErr); }
        }

        setLoading(false);
        console.debug("[useAddEvent] addEventForUser finalizado com sucesso, newEventId:", newEventId);
        return newEventId;
      } catch (err: any) {
        console.warn("[useAddEvent] erro geral:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { addEventForUser, loading, error, eventId };
}

export default useAddEvent;
