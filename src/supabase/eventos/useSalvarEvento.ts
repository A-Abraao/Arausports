import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

type SalvarPayload = {
  titulo: string;
  localizacao: string;
  data: any;
  participantesAtuais?: number;
  categoria?: string;
  ownerId?: string | null;
};

export function useSalvarEvento(eventoId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<Error | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

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
          .eq("user_id", user.id)
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
        setSalvo(false);
        setSavedDocId(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user, eventoId]);

  const salvarEvento = useCallback(
    async (payload?: SalvarPayload) => {
      if (!user || !eventoId) return;
      if (!payload) {
        console.warn("salvarEvento: payload ausente.");
        return;
      }

      if (salvo) {
        console.log("Evento já está salvo. Ignorando.");
        return;
      }

      setLoading(true);
      setErro(null);

      try {
        const insertRow = {
          user_id: user.id,
          evento_id: eventoId,
          titulo: payload.titulo ?? null,
          localizacao: payload.localizacao ?? null,
          data: payload.data ?? null,
          participantes: payload.participantesAtuais ?? 0,
          categoria: payload.categoria ?? "Evento",
          owner_uid: payload.ownerId ?? null,
        };

        const { data, error } = await supabase
          .from("eventos_salvos")
          .insert([insertRow])
          .select()
          .single();

        if (error) {
          console.error("useSalvarEvento insert error:", error);
          setErro(error as any);
          return;
        }

        if (data) {
          setSavedDocId(String((data as any).id));
          setSalvo(true);
        }
      } catch (err: any) {
        console.error("Erro ao salvar evento (supabase):", err);
        setErro(err);
      } finally {
        setLoading(false);
      }
    },
    [user, eventoId, salvo]
  );

  return { salvo, setSalvo, salvarEvento, loading, erro, savedDocId } as const;
}
