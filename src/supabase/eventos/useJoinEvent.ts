import { useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useJoinEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const joinEvent = useCallback(
    async (eventoId: string, participanteId?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        let userId = participanteId ?? null;
        if (!userId) {
          const { data: sessionData } = await supabase.auth.getSession();
          userId = sessionData?.session?.user?.id ?? null;
        }

        if (!userId) {
          throw new Error("Usuário não autenticado");
        }

        const { error } = await supabase.rpc("join_event", {
          p_evento_id: eventoId,
          p_user_id: userId,
        });

        if (error) {
          const msg = (error as any).message ?? "Erro ao entrar no evento";
          throw new Error(msg);
        }

        return true;
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { joinEvent, loading, error } as const;
}
