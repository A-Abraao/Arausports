import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

export function useRemoverEventoSalvo() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSalvo, setLoadingSalvo] = useState(false);
  const [erro, setErro] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(data.session?.user ?? null);
      } catch (e) {
        console.warn("getSession error:", e);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const removerEvento = useCallback(
    async (savedDocId: string | null) => {
      if (!user || !savedDocId) return;
      setLoadingSalvo(true);
      setErro(null);

      try {
        const { error } = await supabase
          .from("eventos_salvos")
          .delete()
          .eq("id", savedDocId)
          .eq("user_id", user.id);

        if (error) {
          console.error("useRemoverEventoSalvo delete error:", error);
          setErro(error as any);
          throw error;
        }
      } catch (e: any) {
        console.error("Erro ao remover evento salvo:", e);
        setErro(e);
        throw e;
      } finally {
        setLoadingSalvo(false);
      }
    },
    [user]
  );

  const removerPorEventoId = useCallback(
    async (eventoId: string | null) => {
      if (!user || !eventoId) return;
      setLoadingSalvo(true);
      setErro(null);

      try {
        const { error } = await supabase
          .from("eventos_salvos")
          .delete()
          .eq("user_id", user.id)
          .eq("evento_id", eventoId);

        if (error) {
          console.error("useRemoverEventoSalvo delete by evento_id error:", error);
          setErro(error as any);
          throw error;
        }
      } catch (e: any) {
        console.error("Erro ao remover por eventoId:", e);
        setErro(e);
        throw e;
      } finally {
        setLoadingSalvo(false);
      }
    },
    [user]
  );

  return { removerEvento, removerPorEventoId, loadingSalvo, erro } as const;
}
