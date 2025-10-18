import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

export type CreatedEvent = {
  id: string;
  titulo: string;
  data: string;
  local: string;
  participantesTotais: number;
  categoria?: string;
};

type Opts = {
  orderBy?: { field: string; direction?: "asc" | "desc" };
};

export function useUserCreatedEvents(userId: string | null, opts?: Opts) {
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [loadingCreated, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<Error | null>(null);

  const participantsCountRef = useRef<Map<string, number>>(new Map());
  const eventsRef = useRef<Map<string, Omit<CreatedEvent, "participantesTotais">>>(new Map());
  const channelRef = useRef<any>(null);
  const participantsChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) {
      eventsRef.current.clear();
      participantsCountRef.current.clear();
      setCreatedEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const orderClause = opts?.orderBy ?? { field: "data", direction: "asc" };

    (async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from("eventos")
          .select("id, titulo, data, local, categoria")
          .eq("owner_id", userId)
          .order(orderClause.field, { ascending: (orderClause.direction ?? "asc") === "asc" });

        if (fetchErr) throw fetchErr;

        eventsRef.current.clear();
        participantsCountRef.current.clear();

        if (data && Array.isArray(data)) {
          await Promise.all(
            data.map(async (ev: any) => {
              const id = String(ev.id);
              eventsRef.current.set(id, {
                id,
                titulo: ev.titulo ?? "",
                data: ev.data ?? "",
                local: ev.local ?? "",
                categoria: ev.categoria ?? "",
              });
              try {
                const { count } = await supabase
                  .from("participantes")
                  .select("*", { head: true, count: "exact" })
                  .eq("evento_id", id);
                participantsCountRef.current.set(id, count ?? 0);
              } catch {
                participantsCountRef.current.set(id, 0);
              }
            })
          );
        }

        rebuildAndSetEvents();
      } catch (err: any) {
        console.error("useUserCreatedEvents fetch error:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    })();

    try {
      channelRef.current = supabase
        .channel(`public:eventos:owner_id=eq.${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "eventos", filter: `owner_id=eq.${userId}` },
          (payload: any) => {
            const eventType = payload.eventType ?? payload.event;
            const newRow = payload.new ?? payload.record;
            const oldRow = payload.old ?? payload.previous;

            if (eventType === "INSERT" || eventType === "UPDATE") {
              const id = String(newRow.id);
              eventsRef.current.set(id, {
                id,
                titulo: newRow.titulo ?? "",
                data: newRow.data ?? "",
                local: newRow.local ?? "",
                categoria: newRow.categoria ?? "",
              });
              (async () => {
                try {
                  const { count } = await supabase
                    .from("participantes")
                    .select("*", { head: true, count: "exact" })
                    .eq("evento_id", id);
                  participantsCountRef.current.set(id, count ?? 0);
                  rebuildAndSetEvents();
                } catch (e) {
                  console.warn("Erro ao buscar participantes realtime:", e);
                }
              })();
            } else if (eventType === "DELETE") {
              const id = String(oldRow.id);
              eventsRef.current.delete(id);
              participantsCountRef.current.delete(id);
            }
            rebuildAndSetEvents();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime eventos subscription falhou:", err);
    }

    try {
      participantsChannelRef.current = supabase
        .channel(`public:participantes:owner_events_${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "participantes" },
          async (payload: any) => {
            const newRow = payload.new ?? payload.record;
            const oldRow = payload.old ?? payload.previous;
            const changedEventId = String(newRow?.evento_id ?? oldRow?.evento_id ?? "");
            if (!changedEventId) return;
            if (eventsRef.current.has(changedEventId)) {
              try {
                const { count } = await supabase
                  .from("participantes")
                  .select("*", { head: true, count: "exact" })
                  .eq("evento_id", changedEventId);
                participantsCountRef.current.set(changedEventId, count ?? 0);
                rebuildAndSetEvents();
              } catch (e) {
                console.warn("Erro ao atualizar participantes (realtime):", e);
              }
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime participantes subscription falhou:", err);
    }

    function rebuildAndSetEvents() {
      const arr: CreatedEvent[] = [];
      eventsRef.current.forEach((base, id) => {
        const participantesTotais = participantsCountRef.current.get(id) ?? 0;
        arr.push({
          id,
          titulo: base.titulo,
          data: base.data,
          local: base.local,
          participantesTotais,
          categoria: base.categoria,
        });
      });

      arr.sort((a, b) => {
        const ta = new Date(a.data).getTime() || 0;
        const tb = new Date(b.data).getTime() || 0;
        return ta - tb;
      });

      setCreatedEvents(arr);
    }

    return () => {
      try {
        if (channelRef.current) supabase.removeChannel(channelRef.current);
      } catch {}
      try {
        if (participantsChannelRef.current) supabase.removeChannel(participantsChannelRef.current);
      } catch {}
      eventsRef.current.clear();
      participantsCountRef.current.clear();
    };
  }, [userId, opts?.orderBy?.field, opts?.orderBy?.direction]);

  return { createdEvents, loadingCreated, error };
}
