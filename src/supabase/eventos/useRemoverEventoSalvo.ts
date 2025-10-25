import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

export function useRemoverEventoSalvo() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSalvo, setLoadingSalvo] = useState(false);
  const [erro, setErro] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await (supabase.auth as any).getUser?.();
        const maybeUser = userRes?.data?.user ?? null;
        if (mountedRef.current) setUser(maybeUser);
      } catch (e) {
        console.warn("useRemoverEventoSalvo getUser error:", e);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => { try { sub?.subscription?.unsubscribe?.(); } catch {} };
  }, []);

  const removerEvento = useCallback(async (savedDocId: string | null) => {
    if (!user || !savedDocId) {
      console.warn("removerEvento: usuário não autenticado ou savedDocId ausente");
      return { ok: false, error: new Error("Não autenticado ou savedDocId ausente") };
    }
    setLoadingSalvo(true);
    setErro(null);

    try {
      const { error } = await supabase
        .from("eventos_salvos")
        .delete()
        .eq("id", savedDocId)
        .eq("usuario_id", user.id);

      if (error) {
        console.error("useRemoverEventoSalvo delete error:", error);
        setErro(error as any);
        setLoadingSalvo(false);
        return { ok: false, error };
      }

      setLoadingSalvo(false);
      return { ok: true };
    } catch (e: any) {
      console.error("Erro ao remover evento salvo:", e);
      if (mountedRef.current) setErro(e);
      setLoadingSalvo(false);
      return { ok: false, error: e };
    }
  }, [user]);

  const removerPorEventoId = useCallback(async (eventoId: string | null) => {
    if (!user || !eventoId) {
      console.warn("removerPorEventoId: usuário não autenticado ou eventoId ausente");
      return { ok: false, error: new Error("Não autenticado ou eventoId ausente") };
    }
    setLoadingSalvo(true);
    setErro(null);

    try {
      const { error } = await supabase
        .from("eventos_salvos")
        .delete()
        .eq("usuario_id", user.id)
        .eq("evento_id", eventoId);

      if (error) {
        console.error("useRemoverEventoSalvo delete by evento_id error:", error);
        setErro(error as any);
        setLoadingSalvo(false);
        return { ok: false, error };
      }

      setLoadingSalvo(false);
      return { ok: true };
    } catch (e: any) {
      console.error("Erro ao remover por eventoId:", e);
      if (mountedRef.current) setErro(e);
      setLoadingSalvo(false);
      return { ok: false, error: e };
    }
  }, [user]);

  return { removerEvento, removerPorEventoId, loadingSalvo, erro } as const;
}

export default useRemoverEventoSalvo;
