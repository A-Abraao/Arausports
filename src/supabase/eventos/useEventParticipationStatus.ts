import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useEventParticipationStatus(eventoId?: string, userId?: string) {
  const [participating, setParticipating] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(!!eventoId && !!userId);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<any | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!eventoId) return;
    setLoading(true);
    setError(null);
    try {
      const session = await supabase.auth.getSession();
      const uid = userId ?? session?.data?.session?.user?.id;
      if (!uid) {
        setParticipating(false);
        return;
      }
      const { data, error } = await supabase
        .from("participantes")
        .select("id")
        .eq("evento_id", eventoId)
        .eq("usuario_id", uid)
        .single();

      if (error && (error as any).code !== "PGRST116") throw error;
      setParticipating(Boolean(data?.id));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setParticipating(false);
    } finally {
      setLoading(false);
    }
  }, [eventoId, userId]);

  useEffect(() => {
    if (!eventoId) return;

    void fetchStatus();

    const channel = supabase
      .channel(`realtime:eventos_participantes`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "participantes", filter: `evento_id=eq.${eventoId}` },
        async (payload) => {
          const session = await supabase.auth.getSession();
          const uid = userId ?? session?.data?.session?.user?.id;
          if (!uid) return;
          if (payload?.new?.usuario_id === uid) setParticipating(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "eventos_participantes", filter: `evento_id=eq.${eventoId}` },
        async (payload) => {
          const session = await supabase.auth.getSession();
          const uid = userId ?? session?.data?.session?.user?.id;
          if (!uid) return;
          if (payload?.old?.usuario_id === uid) setParticipating(false);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current?.unsubscribe) channelRef.current.unsubscribe().catch(() => {});
    };
  }, [eventoId, userId, fetchStatus]);

  return { participating, loading, error, refetch: fetchStatus } as const;
}
