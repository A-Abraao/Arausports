import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

export type EventoSalvoShape = {
  savedId: string; // id da linha em eventos_salvos
  eventoId?: string | null; // id do evento
  titulo?: string | null;
  localizacao?: string | null;
  data?: string | null; // ISO yyy-mm-dd ou null
  categoria?: string | null;
  participantes?: number; // número (usado como capacidade no seu componente)
  salvoEm?: string | null;
  imageUrl?: string | null; // URL pública montada para o frontend renderizar a imagem (ou null)
};

export function useEventosSalvosComParticipantes(userIdArg: string | null = null, { realtime = true } = {}) {
  const [salvos, setSalvos] = useState<EventoSalvoShape[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  const mountedRef = useRef(true);
  const currentUserRef = useRef<string | null>(userIdArg);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  //variavel que guarda url do supabse
  const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
  //função que pega a imagem e usa ela para montar a url
  // dentro do useEventosSalvosComParticipantes.ts (substitua sua função)
  function buildPublicImageUrl(path?: string | null) {
    if (!path) return null;
    if (typeof path !== "string") return null;

    // se já for uma URL completa, devolve ela
    if (/^https?:\/\//i.test(path)) return path;

    const base = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
    if (!base) {
      console.warn("[buildPublicImageUrl] VITE_SUPABASE_URL indefinida — path:", path);
      return null;
    }

  const url = `${base.replace(/\/$/, "")}/storage/v1/object/public/public-images/${encodeURIComponent(path)}`;
    // log de debug (comente depois)
    // console.log("[buildPublicImageUrl] built url:", url);
    return url;
  }


  const buildShapeFromJoinRow = (row: any): EventoSalvoShape => {
    const ev = row.eventos ?? {};
    console.log("[buildShapeFromJoinRow] evento.imagem_url:", ev.imagem_url, "evento.id:", ev.id);
    const dataRaw = ev.data_evento ?? ev.data ?? null;
    const dataISO = dataRaw ? new Date(dataRaw).toISOString().slice(0, 10) : null;
    const imagemPath = ev.imagem_url ?? null;
    return {
      savedId: String(row.id ?? row.savedId ?? ""),
      eventoId: row.evento_id ?? ev.id ?? null,
      titulo: ev.titulo ?? row.titulo ?? "",
      localizacao: ev.local ?? ev.localizacao ?? row.localizacao ?? "",
      data: dataISO,
      categoria: ev.categoria ?? row.categoria ?? null,
      participantes: Number(ev.participantes_atual ?? ev.participantes ?? ev.capacidade_max ?? row.participantes ?? 0) || 0,
      salvoEm: row.salvo_em ?? null,
      imageUrl: buildPublicImageUrl(imagemPath),
    };
  };


  const buildShapeFromSeparate = (savedRow: any, eventRow: any | undefined): EventoSalvoShape => {
    const ev = eventRow ?? {};
    const dataRaw = ev.data_evento ?? ev.data ?? savedRow.data ?? null;
    const dataISO = dataRaw ? new Date(dataRaw).toISOString().slice(0, 10) : null;
    const imagemPath = ev.imagem_url ?? savedRow.imagem_url ?? null;
    return {
      savedId: String(savedRow.id ?? savedRow.savedId ?? ""),
      eventoId: savedRow.evento_id ?? ev.id ?? null,
      titulo: ev.titulo ?? savedRow.titulo ?? "",
      localizacao: ev.local ?? savedRow.localizacao ?? "",
      data: dataISO,
      categoria: ev.categoria ?? savedRow.categoria ?? null,
      participantes: Number(ev.participantes_atual ?? ev.participantes ?? savedRow.participantes ?? 0) || 0,
      salvoEm: savedRow.salvo_em ?? null,
      imageUrl: buildPublicImageUrl(imagemPath),
    };
  };


  const load = useCallback(
    async (opts?: { userIdOverride?: string | null }) => {
      setLoading(true);
      setError(null);

      try {
        // resolve user id (argument override -> provided userIdArg -> supabase auth)
        const provided = opts?.userIdOverride ?? userIdArg ?? currentUserRef.current;
        let uid = provided ?? null;
        if (!uid) {
          try {
            const userRes = await (supabase.auth as any).getUser?.();
            uid = userRes?.data?.user?.id ?? null;
          } catch {
            uid = null;
          }
        }
        currentUserRef.current = uid;

        if (!uid) {
          if (mountedRef.current) {
            setSalvos([]);
            setLoading(false);
          }
          return;
        }

        // tentativa 1: buscar com join (eventos(*)) — funciona se FK está declarada
        const joinRes = await supabase
        .from("eventos_salvos")
        .select("id, usuario_id, evento_id, salvo_em, eventos(id, titulo, local, data_evento, categoria, capacidade_max, participantes_atual, imagem_url)")
        .eq("usuario_id", uid)
        .order("salvo_em", { ascending: false });

        if (joinRes.error) {
          // se o erro indicar que a relação não existe, fazemos fallback
          const msg = String((joinRes.error as any)?.message ?? "");
          const needsFallback =
            /relationship|column.*not found|could not find the 'eventos'|no relation|undefined table/i.test(msg);

          if (!needsFallback) {
            throw joinRes.error;
          }

          // fallback: buscar saved rows e então buscar events por ids
          const { data: savedRows, error: savedErr } = await supabase
            .from("eventos_salvos")
            .select("id, usuario_id, evento_id, salvo_em")
            .eq("usuario_id", uid)
            .order("salvo_em", { ascending: false });

          if (savedErr) throw savedErr;

          const eventoIds = (savedRows ?? []).map((r: any) => r.evento_id).filter(Boolean);
          let eventsById: Record<string, any> = {};
          if (eventoIds.length > 0) {
            const { data: eventsData, error: eventsErr } = await supabase
              .from("eventos")
              .select("id, titulo, local, data_evento, categoria, capacidade_max, participantes_atual, imagem_url")
              .in("id", eventoIds);
            if (eventsErr) throw eventsErr;
            (eventsData ?? []).forEach((e: any) => { eventsById[String(e.id)] = e; });
          }

          const mapped = (savedRows ?? []).map((r: any) => buildShapeFromSeparate(r, eventsById[String(r.evento_id)]));
          if (mountedRef.current) setSalvos(mapped);
          if (mountedRef.current) setLoading(false);
          return;
        }

        // normal path: map joinres.data
        const joinedData = joinRes.data ?? [];

        if (joinRes.data) {
          console.log("[useEventosSalvos] raw joined rows:", joinRes.data);
        }

        const mapped = (joinedData as any[]).map((row) => buildShapeFromJoinRow(row));
        if (mountedRef.current) setSalvos(mapped);
        if (mountedRef.current) setLoading(false);

      } catch (err) {
        console.error("useEventosSalvosComParticipantes load error:", err);
        if (mountedRef.current) setError(err);
        if (mountedRef.current) setLoading(false);
      }
    },
    [userIdArg]
  );

  // initial load
  useEffect(() => {
    void load();
  }, [load]);

  // optional realtime: recarega os eventos salvos para o usuário
  useEffect(() => {
  if (!realtime) return;
  let channel: any = null;
  let subscribed = false;

  (async () => {
    try {
      const userRes = await (supabase.auth as any).getUser?.();
      const uid = userIdArg ?? userRes?.data?.user?.id ?? null;
      if (!uid) return;

      channel = supabase
        .channel(`private:eventos_salvos:${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "eventos_salvos", filter: `usuario_id=eq.${uid}` },
          (payload: any) => {
            console.log("[realtime eventos_salvos] payload:", payload);
            // sempre manda o fetch de volta
            void load();
          }
        )
        //fallback para saber se subscribe do realtime deu certo mesmo
        .subscribe((status) => {
          //condicional que verifica se tem erro
          if ((status as any)?.error) {
            //mostra no console o erro
            console.error("[realtime] subscribe error:", (status as any).error);
          } else {
            //se deu certo ele mostra no console que deu certo e ativa o realtime
            subscribed = true;
            console.log("[realtime] subscribed to eventos_salvos for");
          }
        });
    } catch (err) {
      console.warn("useEventosSalvosComParticipantes realtime setup error:", err);
    }
  })();

  return () => {
    try {
      if (channel) supabase.removeChannel(channel);
      if (subscribed) console.log("[realtime] unsubscribed");
    } catch (e) {}
  };
}, [realtime, load, userIdArg]);


  const refresh = useCallback(() => {
    return load();
  }, [load]);

  return { salvos, loading, error, refresh };
}

export default useEventosSalvosComParticipantes;
