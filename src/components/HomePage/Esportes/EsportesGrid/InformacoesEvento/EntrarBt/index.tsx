import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { supabase } from "../../../../../../supabase/supabaseClient";
import { useJoinEvent } from "../../../../../../supabase";
import { useExitEvent } from "../../../../../../supabase";

type Props = {
  eventoId: string;
  ownerId?: string;
};

export function EntrarBt({ eventoId }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const { joinEvent, loading: loadingJoin } = useJoinEvent();
  const { exitEvent, loading: loadingExit } = useExitEvent();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const uid = data?.session?.user?.id ?? null;
        if (!mounted) return;
        setUserId(uid);
      } catch {
        if (!mounted) return;
        setUserId(null);
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    const subscription = (authListener as any)?.subscription ?? null;

    return () => {
      mounted = false;
      
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      } else if (subscription && typeof (subscription as any).remove === "function") {
          (subscription as any).remove();
      }
      
    };
  }, []);

  useEffect(() => {
    if (!eventoId) return;
    if (!userId) {
      setIsParticipant(false);
      return;
    }

    let mounted = true;
    setChecking(true);

    (async () => {
      try {
        const { data, error } = await supabase
          .from("eventos_participantes")
          .select("id")
          .eq("evento_id", eventoId)
          .eq("user_id", userId)
          .limit(1);

        if (!mounted) return;
        if (error) {
          console.error("Erro ao checar inscrição:", error);
          setIsParticipant(false);
        } else {
          setIsParticipant(Array.isArray(data) && data.length > 0);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Erro ao checar inscrição (catch):", err);
        setIsParticipant(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    const channel = supabase
      .channel(`event_part:${eventoId}:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "eventos_participantes",
          filter: `evento_id=eq.${eventoId},user_id=eq.${userId}`,
        },
        (payload: any) => {
          try {
            const eventType = payload?.event ?? payload?.type ?? null;
            if (eventType === "DELETE") {
              setIsParticipant(false);
            } else if (eventType === "INSERT" || eventType === "UPDATE") {
              setIsParticipant(true);
            } else {
              if (payload?.new) setIsParticipant(true);
              else if (payload?.old && !payload?.new) setIsParticipant(false);
            }
          } catch (e) {
            console.warn("subscription handler error", e);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
        if (channel && typeof (channel as any).unsubscribe === "function") {
          (channel as any).unsubscribe().catch(() => {});
        } else {
          try {
            supabase.removeChannel(channel);
          } catch {}
        }
    };
  }, [eventoId, userId]);

  const normalizeResult = (res: any) => {
    if (res == null) return { ok: false, error: new Error("sem resposta") };
    if (typeof res === "boolean") return { ok: res, error: null };
    return { ok: Boolean(res?.ok), error: res?.error ?? null };
  };

  const handleJoin = async () => {
    if (!userId) {
      console.warn("Usuário não autenticado");
      return;
    }
    try {
      setIsParticipant(true);
      const raw = await joinEvent(eventoId, userId);
      const { ok, error } = normalizeResult(raw);
      if (!ok) {
        setIsParticipant(false);
        const message = error?.message ?? String(error ?? "Erro ao entrar");
        console.error("joinEvent falhou:", message);
      } else {
        setIsParticipant(true);
      }
    } catch (e) {
      console.error("Erro no join:", e);
      setIsParticipant(false);
    }
  };

  const handleExit = async () => {
    if (!userId) return;
    try {
      setIsParticipant(false);
      const raw = await exitEvent(eventoId, userId);
      const { ok, error } = normalizeResult(raw);
      if (!ok) {
        setIsParticipant(true);
        console.error("exitEvent falhou:", error ?? "erro");
      } else {
        setIsParticipant(false);
      }
    } catch (e) {
      console.error("Erro no exit:", e);
      setIsParticipant(true);
    }
  };

  const busy = checking || loadingJoin || loadingExit;
  const disabled = busy || !userId;

  if (isParticipant === null) {
    return <Button disabled>carregando...</Button>;
  }

  return isParticipant ? (
    <Button variant="outlined" onClick={handleExit} disabled={disabled} color="error">
      Sair
    </Button>
  ) : (
    <Button variant="contained" onClick={handleJoin} disabled={disabled}>
      Entrar
    </Button>
  );
}

export default EntrarBt;
