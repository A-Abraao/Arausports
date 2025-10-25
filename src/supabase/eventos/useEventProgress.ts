import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

type UseEventProgressResult = {
  participantesAtuais: number | null;
  capacidade: number | null;
  percentual: number | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useEventProgress(eventoId?: string): UseEventProgressResult {
  const [participantesAtuais, setParticipantesAtuais] = useState<number | null>(null);
  const [capacidade, setCapacidade] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(!!eventoId);
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef(true);
  const channelRef = useRef<any | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchOnce = useCallback(async () => {
    if (!eventoId) {
      setParticipantesAtuais(null);
      setCapacidade(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: selErr } = await supabase
        .from("eventos")
        .select("participantes_atual, capacidade_max")
        .eq("id", eventoId)
        .maybeSingle();

      if (selErr) throw selErr;

      if (!mountedRef.current) return;

      const atual = Number(data?.participantes_atual ?? null);
      const cap = data?.capacidade_max == null ? null : Number(data.capacidade_max);

      setParticipantesAtuais(Number.isFinite(atual) ? atual : 0);
      setCapacidade(Number.isFinite(cap ?? NaN) ? cap : null);
    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    // inicial fetch
    void fetchOnce();

    if (!eventoId) return;

    // subscrição realtime para a linha do evento
    const channel = supabase
      .channel(`public:eventos:id=eq.${eventoId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventos", filter: `id=eq.${eventoId}` },
        (payload: any) => {
          try {
            // payload pode ter .new / .old / .record conforme versão
            const ev = (payload?.new ?? payload?.record ?? payload) as any;
            const eventType = (payload?.eventType ?? payload?.event ?? "").toString().toUpperCase();

            // preferir valores vindos do payload.new (INSERT/UPDATE)
            if (ev) {
              const atual = ev.participantes_atual ?? ev.participants ?? ev.participantesAtuais ?? null;
              const cap = ev.capacidade_max ?? ev.capacidade ?? null;

              if (typeof atual !== "undefined" && atual !== null) {
                const parsedAt = Number(atual);
                if (Number.isFinite(parsedAt)) setParticipantesAtuais(parsedAt);
              }

              if (typeof cap !== "undefined" && cap !== null) {
                const parsedCap = Number(cap);
                if (Number.isFinite(parsedCap)) setCapacidade(parsedCap);
              }
            } else {
              // em caso de DELETE (não haverá new), tentar refetch para manter consistência
              if (eventType === "DELETE") {
                void fetchOnce();
              }
            }
          } catch (e) {
            // não bloquear a UI por erros de parsing
            console.warn("useEventProgress realtime handler error:", e);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      try {
        if (channelRef.current) {
          // prefer removeChannel (versões supabase mais novas)
          supabase.removeChannel(channelRef.current);
        }
      } catch {
        try {
          channelRef.current?.unsubscribe?.();
        } catch {}
      }
    };
  }, [eventoId, fetchOnce]);

  const percentual = (() => {
    const cap = capacidade ?? null;
    const atual = participantesAtuais ?? null;
    if (cap == null || cap <= 0 || atual == null) return null;
    const pct = Math.min(100, Math.round((atual / Math.max(1, cap)) * 100));
    return pct;
  })();

  return {
    participantesAtuais,
    capacidade,
    percentual,
    loading,
    error,
    refetch: fetchOnce,
  };
}

export default useEventProgress;
