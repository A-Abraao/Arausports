import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";

type LeaveResult = { ok: boolean; newCount?: number; message?: string };

export function useExitEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const leaveEvent = useCallback(async (eventoId: string, participantId?: string): Promise<LeaveResult> => {
    setLoading(true);
    setError(null);
    try {
      const session = await supabase.auth.getSession();
      const userId = participantId ?? session?.data?.session?.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      const { data, error: rpcErr } = await supabase.rpc("leave_event", { p_evento: eventoId, p_user_id: userId });
      if (rpcErr) throw rpcErr;

      const newCount = Array.isArray(data)
        ? data[0]?.new_count ?? data[0]?.participantes_atual ?? undefined
        : (data as any)?.new_count ?? (data as any)?.participantes_atual ?? undefined;

      return { ok: true, newCount: typeof newCount === "number" ? newCount : undefined };
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return { ok: false, message: err?.message ?? String(err) };
    } finally {
      setLoading(false);
    }
  }, []);

  return { leaveEvent, loading, error } as const;
}
