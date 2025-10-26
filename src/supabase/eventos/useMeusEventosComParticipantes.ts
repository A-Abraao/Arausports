import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

//todos os dados que vã ser pegos no get são definidos aqui menó
export type MeuEventoShape = {
    //pega todos os dados do evento criado
  id: string;
  usuarioId?: string | null;
  titulo?: string | null;
  local?: string | null;
  data?: string | null; // ISO yyyy-mm-dd
  horario?: string | null; // hh:mm:ss ou nulo
  categoria?: string | null;
  capacidadeMax?: number;
  participantesAtual?: number;
  imageUrl?: string | null; // url pública pronta para o frontend
  criadorFotoUrl?: string | null; // imagem do cara que criou o evento
};

export function useMeusEventosComParticipantes(userIdArg: string | null = null, { realtime = true } = {}) {
  const [eventos, setEventos] = useState<MeuEventoShape[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  const mountedRef = useRef(true);
  const currentUserRef = useRef<string | null>(userIdArg);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";

  function buildPublicImageUrl(path?: string | null) {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (/^https?:\/\//i.test(path)) return path;
    const base = SUPABASE_URL;
    if (!base) {
      console.warn("[buildPublicImageUrl] VITE_SUPABASE_URL indefinida — path:", path);
      return null;
    }
    return `${base.replace(/\/$/, "")}/storage/v1/object/public/public-images/${encodeURIComponent(path)}`;
  }

  //aqui ele construi a linha da requisição para pegar os dados
  const buildShapeFromRow = (row: any): MeuEventoShape => {
    const dataRaw = row.data_evento ?? row.data ?? null;
    const dataISO = dataRaw ? new Date(dataRaw).toISOString().slice(0, 10) : null;
    const imagemPath = row.imagem_url ?? null;
    const criador = row.usuarios ?? row.criador ?? {};
    return {
      id: String(row.id ?? ""),
      usuarioId: row.usuario_id ?? null,
      titulo: row.titulo ?? null,
      local: row.local ?? null,
      data: dataISO,
      horario: row.horario ?? null,
      categoria: row.categoria ?? null,
      capacidadeMax: Number(row.capacidade_max ?? 0) || 0,
      participantesAtual: Number(row.participantes_atual ?? 0) || 0,
      imageUrl: buildPublicImageUrl(imagemPath),
      criadorFotoUrl: buildPublicImageUrl(criador?.foto_url ?? null),
    };
  };

  const load = useCallback(async (opts?: { userIdOverride?: string | null }) => {
    setLoading(true);
    setError(null);
    try {
      // resolve user id
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
          setEventos([]);
          setLoading(false);
        }
        return;
      }

      // buscar com join (tabela dos usuarios lá)
      const joinRes = await supabase
        .from("eventos")
        .select("id, usuario_id, titulo, local, data_evento, horario, categoria, capacidade_max, participantes_atual, imagem_url, criado_em, usuarios(id, nome, foto_url)")
        .eq("usuario_id", uid)
        .order("data_evento", { ascending: false });

      if (joinRes.error) {
        const msg = String((joinRes.error as any)?.message ?? "");
        const needsFallback = /relationship|column.*not found|could not find the 'usuarios'|no relation|undefined table/i.test(msg);
        if (!needsFallback) {
          throw joinRes.error;
        }

        // fallback: buscar eventos separadamente sem join
        const { data: eventsData, error: eventsErr } = await supabase
          .from("eventos")
          .select("id, usuario_id, titulo, local, data_evento, horario, categoria, capacidade_max, participantes_atual, imagem_url, criado_em")
          .eq("usuario_id", uid)
          .order("data_evento", { ascending: false });
        if (eventsErr) throw eventsErr;

        const mapped = (eventsData ?? []).map((r: any) => buildShapeFromRow(r));
        if (mountedRef.current) setEventos(mapped);
        if (mountedRef.current) setLoading(false);
        return;
      }

      const rows = joinRes.data ?? [];
      const mapped = (rows as any[]).map((r) => buildShapeFromRow(r));
      if (mountedRef.current) setEventos(mapped);
      if (mountedRef.current) setLoading(false);
    } catch (err) {
      console.error("useMeusEventosComParticipantes load error:", err);
      if (mountedRef.current) setError(err);
      if (mountedRef.current) setLoading(false);
    }
  }, [userIdArg]);

  // carregamento inicisl
  useEffect(() => { void load(); }, [load]);

  // efeito de realtime pros cara ver lá
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
          .channel(`private:eventos:${uid}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "eventos", filter: `usuario_id=eq.${uid}` },
            (payload: any) => {
              console.log("[realtime eventos] payload:", payload);
              void load();
            }
          )
          .subscribe((status) => {
            if ((status as any)?.error) {
              console.error("[realtime] subscribe error:", (status as any).error);
            } else {
              subscribed = true;
              console.log("[realtime] subscribed to eventos for", uid);
            }
          });
      } catch (err) {
        console.warn("useMeusEventosComParticipantes realtime setup error:", err);
      }
    })();

    return () => {
      try {
        if (channel) supabase.removeChannel(channel);
        if (subscribed) console.log("[realtime] unsubscribed");
      } catch (e) {}
    };
  }, [realtime, load, userIdArg]);

  const refreshCriados = useCallback(() => load(), [load]);

  return { eventos, loading, error, refreshCriados } as const;
}

export default useMeusEventosComParticipantes;
