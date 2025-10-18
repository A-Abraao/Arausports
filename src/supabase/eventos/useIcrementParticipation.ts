import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useIncrementParticipation(userId?: string) {
  const [participacoes, setParticipacoes] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<any | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!userId) {
      setParticipacoes(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data, error: selErr } = await supabase
          .from("usuarios")
          .select("participacoes")
          .eq("id", userId)
          .single();

        if (selErr) throw selErr;

        if (!mounted) return;
        setParticipacoes((data?.participacoes ?? 0) as number);
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setParticipacoes(0);
        setLoading(false);
      }
    })();

    channelRef.current = supabase
      .channel(`public:usuarios:id=eq.${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "usuarios", filter: `id=eq.${userId}` },
        (payload: any) => {
          try {
            const newVal = payload?.new;
            if (newVal && typeof newVal.participacoes === "number") {
              setParticipacoes(newVal.participacoes);
            }
          } catch (e) {
            console.log("ó o erro ai" + e)
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channelRef.current?.unsubscribe) {
        channelRef.current.unsubscribe().catch(() => {});
      } else if (channelRef.current) {
        try { channelRef.current.remove?.(); } catch { }
      }
    };
  }, [userId]);

  const changeParticipacoes = useCallback(
    async (delta: number) => {
      if (!userId) {
        setError(new Error("userId não fornecido"));
        return false;
      }
      if (delta === 0) return true;

      setLoading(true);
      setError(null);

      try {
        const { data: rpcData, error: rpcErr } = await supabase.rpc("increment_user_participacoes", {
          p_user_id: userId,
          p_delta: delta,
        });

        if (rpcErr) throw rpcErr;

        if (rpcData == null) {

          const { data: selData, error: selErr } = await supabase
            .from("usuarios")
            .select("participacoes")
            .eq("id", userId)
            .single();
          if (selErr) throw selErr;
          setParticipacoes(selData?.participacoes ?? 0);
        } else {
          const newCount =
            typeof rpcData === "number"
              ? rpcData
              : (rpcData as any)?.participacoes ?? (Array.isArray(rpcData) ? rpcData[0]?.participacoes : undefined);

          if (typeof newCount === "number") {
            setParticipacoes(newCount);
          } else {
            const { data: selData, error: selErr } = await supabase
              .from("usuarios")
              .select("participacoes")
              .eq("id", userId)
              .single();
            if (selErr) throw selErr;
            setParticipacoes(selData?.participacoes ?? 0);
          }
        }

        setLoading(false);
        return true;
      } catch (err) {
        // RPC não existe ou falhou — fallback (não-atomico): read + update
        try {
          const { data: selData, error: selErr } = await supabase
            .from("usuarios")
            .select("participacoes")
            .eq("id", userId)
            .single();

          if (selErr) throw selErr;

          const current = Number(selData?.participacoes ?? 0);
          const newVal = Math.max(0, current + delta);

          const { error: upErr } = await supabase
            .from("usuarios")
            .update({ participacoes: newVal })
            .eq("id", userId);

          if (upErr) throw upErr;

          setParticipacoes(newVal);
          setLoading(false);
          return true;
        } catch (fallbackErr: any) {
          setError(fallbackErr instanceof Error ? fallbackErr : new Error(String(fallbackErr)));
          setLoading(false);
          return false;
        }
      }
    },
    [userId]
  );

  const incrementParticipacoes = useCallback((by = 1) => changeParticipacoes(by), [changeParticipacoes]);
  const decrementParticipacoes = useCallback((by = 1) => changeParticipacoes(-by), [changeParticipacoes]);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: selErr } = await supabase.from("usuarios").select("participacoes").eq("id", userId).single();
      if (selErr) throw selErr;
      setParticipacoes(data?.participacoes ?? 0);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    participacoes,
    loading,
    error,
    incrementParticipacoes,
    decrementParticipacoes,
    refetch,
  } as const;
}
