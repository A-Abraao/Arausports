import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

export type Evento = {
  id: string;
  ownerId?: string | null; // corresponde a eventos.usuario_id
  titulo: string;
  categoria: string;
  data: string | null; // ISO yy-mmm-dd (ou null)
  horario: string | null; // hh:mm:ss (ou null)
  local: string;
  capacidade: number; // capacidade_max
  participantesAtuais?: number; // participantes_atual
  imageUrl?: string | null; // public URL montada para o frontend
  criadoEm?: string | null;
};

// garantir que a env esteja definida, mesma var usada no supabaseClient)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";

export function useEventData({ realtime = true, limit }: { realtime?: boolean; limit?: number } = {}) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // evitar setState após unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const buildPublicImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    // remove eventual trailing slash e monta URL pública do bucket `public-images`
    const base = SUPABASE_URL.replace(/\/$/, "");
    return `${base}/storage/v1/object/public/public-images/${encodeURIComponent(path)}`;
  };

  const normalizeRow = (row: any): Evento => {
    const imagePath = row.imagem_url ?? row.imageUrl ?? null;
    const dataEventoRaw = row.data_evento ?? row.data ?? null;
    const dataISO = dataEventoRaw ? new Date(dataEventoRaw).toISOString().slice(0, 10) : null;

    return {
      id: String(row.id ?? row.event_id ?? ""),
      ownerId: row.usuario_id ?? null,
      titulo: row.titulo ?? "Sem título",
      categoria: row.categoria ?? "Evento",
      data: dataISO,
      horario: row.horario ?? null,
      local: row.local ?? row.localizacao ?? "Local não informado",
      capacidade: Number(row.capacidade_max ?? row.capacidade ?? 0) || 0,
      participantesAtuais: Number(row.participantes_atual ?? row.participantesAtuais ?? row.participants ?? 0) || 0,
      imageUrl: buildPublicImageUrl(imagePath),
      criadoEm: row.criado_em ?? row.created_at ?? null,
    };
  };

  const load = useCallback(
    async (opts?: { limit?: number }) => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("eventos")
          .select(
            "id, usuario_id, titulo, categoria, data_evento, horario, local, capacidade_max, participantes_atual, imagem_url, criado_em"
          )
          .order("criado_em", { ascending: false });

        if (opts?.limit && typeof opts.limit === "number") {
          query = (query as any).range(0, Math.max(0, opts.limit - 1));
        }

        const { data, error: supError } = await query;
        if (supError) throw supError;

        if (!mountedRef.current) return;

        const mapped: Evento[] = (data ?? []).map((row: any) => normalizeRow(row));
        if (mountedRef.current) setEventos(mapped);
      } catch (err: any) {
        console.error("useEventData supabase error:", err);
        if (mountedRef.current) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    []
  );

  // inicial fetch
  useEffect(() => {
    void load({ limit });
  }, [load, limit]);

  // realtime subscription
  useEffect(() => {
    if (!realtime) return;

    // criar canal para eventos
    const channel = supabase
      .channel("public:eventos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventos" },
        (payload) => {
          try {
   
            const ev = ((payload as any).new ?? (payload as any).record ?? (payload as any)) as any;
            // payload.eventType (v2) ou payload.event (algumas versões) da insert/update/delete
            const eventType = (payload.eventType ?? (payload as any).event ?? "").toString().toUpperCase();

            // obter id do registro (insert/update/delete)
            const id = String(ev?.id ?? ev?.evento_id ?? "");
            if (!id) return;

            if (eventType === "INSERT") {
              const newEvent = normalizeRow(ev);
              setEventos((prev) => [newEvent, ...prev.filter((p) => p.id !== newEvent.id)]);
              return;
            }

            if (eventType === "UPDATE") {
              setEventos((prev) =>
                prev.map((p) => {
                  if (p.id !== id) return p;
                  const updated = normalizeRow(ev);
                  // manter ordem
                  return { ...p, ...updated };
                })
              );
              return;
            }

            if (eventType === "DELETE") {
              setEventos((prev) => prev.filter((p) => p.id !== id));
              return;
            }
          } catch (e) {
            console.warn("Realtime handler error:", e);
          }
        }
      )
      .subscribe();

    return () => {
      // limpa ele vai remover channel / unsubscribe
      try {
        supabase.removeChannel(channel);
      } catch {
        try {
          channel.unsubscribe?.();
        } catch {}
      }
    };
  }, [realtime]);

  const refresh = useCallback(() => {
    return load({ limit });
  }, [load, limit]);

  return { eventos, loading, error, refresh };
}

export default useEventData;
