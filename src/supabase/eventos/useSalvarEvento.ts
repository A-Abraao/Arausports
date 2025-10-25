import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

type SalvarPayload = {
  titulo?: string | null;
  localizacao?: string | null;
  data?: any | null;
  participantesAtuais?: number;
  categoria?: string | null;
  ownerId?: string | null;
};

//função que exporta o hook para geral usar
export function useSalvarEvento(eventoId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<Error | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // bootstrap user + subscribe
  useEffect(() => {
    (async () => {
      try {
        //salva o usuario na variavel userRes
        const userRes = await (supabase.auth as any).getUser?.();
        //variavel que verifica se o usuário foi buscado com sucesso, da null se não deu certo
        const maybeUser = userRes?.data?.user ?? null;
        if (mountedRef.current) setUser(maybeUser);
        //mostra o erro no console caso haja algo erro
      } catch (e) {
        console.warn("useSalvarEvento getUser error:", e);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      try { sub?.subscription?.unsubscribe?.(); } catch {}
    };
  }, []);

  // checar se já foi salvo
  useEffect(() => {
    if (!user || !eventoId) {
      setSalvo(false);
      setSavedDocId(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("eventos_salvos")
          .select("id")
          .eq("usuario_id", user.id)
          .eq("evento_id", eventoId)
          .limit(1);

        if (!mounted) return;
        if (error) {
          console.error("useSalvarEvento select error:", error);
          setSalvo(false);
          setSavedDocId(null);
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setSalvo(true);
          setSavedDocId(String((data[0] as any).id));
        } else {
          setSalvo(false);
          setSavedDocId(null);
        }
      } catch (e) {
        console.error("useSalvarEvento checking saved state:", e);
        if (mounted) {
          setSalvo(false);
          setSavedDocId(null);
        }
      }
    })();
    return () => { mounted = false; };
  }, [user, eventoId]);

  const salvarEvento = useCallback(async (payload?: SalvarPayload) => {
    if (!user || !eventoId) {
      console.warn("salvarEvento: usuário não autenticado ou eventoId ausente");
      return { ok: false, error: new Error("Não autenticado ou eventoId ausente") };
    }
    if (!payload) {
      console.warn("salvarEvento: payload ausente.");
      return { ok: false, error: new Error("Payload ausente") };
    }
    if (salvo) return { ok: true, alreadySaved: true };

    setLoading(true);
    setErro(null);

    try {
      // trecho corrigido dentro de salvarEvento
      const insertRow: Record<string, any> = {
        usuario_id: user.id,
        evento_id: eventoId,
        salvo_em: new Date().toISOString(),
      };

      // upsert: passar array de valores e onConflict como string (colunas separadas por vírgula)
      const upsertRes = await supabase
        .from("eventos_salvos")
        .upsert([insertRow], { onConflict: "usuario_id,evento_id" })
        .select();

      const data = Array.isArray(upsertRes.data) ? upsertRes.data[0] ?? null : upsertRes.data ?? null;
      const error = upsertRes.error ?? null;

      if (error) {
        // se der violação de unique por algum motivo, tratamos como já salvo
        if ((error as any)?.code === "23505") {
          setLoading(false);
          return { ok: true, alreadySaved: true };
        }
        console.error("useSalvarEvento insert error:", error);
        setErro(error as any);
        setLoading(false);
        return { ok: false, error };
      }

      if (data) {
        const id = String((data as any).id ?? "");
        if (mountedRef.current) {
          setSavedDocId(id || null);
          setSalvo(true);
        }
      }

      setLoading(false);
      return { ok: true, saved: data ?? null };
    } catch (err: any) {
      console.error("Erro ao salvar evento (supabase):", err);
      if (mountedRef.current) setErro(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      return { ok: false, error: err };
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [user, eventoId, salvo]);

  return { salvo, setSalvo, salvarEvento, loading, erro, savedDocId } as const;
}

export default useSalvarEvento;
