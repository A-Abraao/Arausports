import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

type SalvoItem = {
  savedId: string;
  eventoId?: string;
  ownerUid?: string;
  titulo?: string;
  localizacao?: string;
  data?: string;
  categoria?: string;
  participantes?: number;
  participantesTotais?: number;
  [k: string]: any;
};

export function useEventosSalvosComParticipantes(userIdParam?: string | null) {
  const [salvos, setSalvos] = useState<SalvoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<Error | null>(null);
  const userIdRef = useRef<string | null>(userIdParam ?? null);
  const eventsMapRef = useRef<Map<string, any>>(new Map());
  const channelRef = useRef<any>(null);
  const participantsChannelRef = useRef<any>(null);

  useEffect(() => {
    userIdRef.current = userIdParam ?? null;
  }, [userIdParam]);

  useEffect(() => {
    const userId = userIdRef.current;
    if (!userId) {
      setSalvos([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setErro(null);

    (async () => {
      try {
        const { data: savedRows, error: savedErr } = await supabase
          .from("eventos_salvos")
          .select("id, evento_id, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (savedErr) throw savedErr;

        const base: SalvoItem[] = [];

        if (savedRows && Array.isArray(savedRows)) {
          await Promise.all(
            savedRows.map(async (s: any) => {
              const savedId = String(s.id);
              const eventoId = s.evento_id ?? null;
              let eventRow: any = null;
              if (eventoId) {
                const { data: evData } = await supabase
                  .from("eventos")
                  .select("id, owner_id, titulo, local, data, categoria")
                  .eq("id", eventoId)
                  .maybeSingle();
                eventRow = evData;
              }

              let participantes = 0;
              if (eventoId) {
                try {
                  const { count } = await supabase
                    .from("participantes")
                    .select("*", { head: true, count: "exact" })
                    .eq("evento_id", eventoId);
                  participantes = count ?? 0;
                } catch {
                  participantes = 0;
                }
              }

              const item: SalvoItem = {
                savedId,
                eventoId: eventoId ?? undefined,
                ownerUid: eventRow?.owner_id ?? undefined,
                titulo: eventRow?.titulo ?? undefined,
                localizacao: eventRow?.local ?? undefined,
                data: eventRow?.data ?? undefined,
                categoria: eventRow?.categoria ?? undefined,
                participantes: participantes,
                participantesTotais: participantes,
              };

              if (eventoId) eventsMapRef.current.set(eventoId, savedId);
              base.push(item);
            })
          );
        }

        if (!mounted) return;
        setSalvos(base);
        setLoading(false);

        try {
          channelRef.current = supabase
            .channel(`public:eventos_salvos:user_${userId}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "eventos_salvos", filter: `user_id=eq.${userId}` },
              async () => {
                try {
                  const { data: nextSaved } = await supabase
                    .from("eventos_salvos")
                    .select("id, evento_id, created_at")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });

                  if (!nextSaved) return;
                  const rebuilt: SalvoItem[] = [];
                  await Promise.all(
                    nextSaved.map(async (s: any) => {
                      const savedId = String(s.id);
                      const eventoId = s.evento_id ?? null;
                      let eventRow: any = null;
                      if (eventoId) {
                        const { data: evData } = await supabase
                          .from("eventos")
                          .select("id, owner_id, titulo, local, data, categoria")
                          .eq("id", eventoId)
                          .maybeSingle();
                        eventRow = evData;
                      }
                      let participantes = 0;
                      if (eventoId) {
                        const { count } = await supabase
                          .from("participantes")
                          .select("*", { head: true, count: "exact" })
                          .eq("evento_id", eventoId);
                        participantes = count ?? 0;
                      }
                      rebuilt.push({
                        savedId,
                        eventoId: eventoId ?? undefined,
                        ownerUid: eventRow?.owner_id ?? undefined,
                        titulo: eventRow?.titulo ?? undefined,
                        localizacao: eventRow?.local ?? undefined,
                        data: eventRow?.data ?? undefined,
                        categoria: eventRow?.categoria ?? undefined,
                        participantes,
                        participantesTotais: participantes,
                      });
                    })
                  );
                  if (mounted) setSalvos(rebuilt);
                } catch (e) {
                  console.warn("Erro ao refetch eventos_salvos realtime:", e);
                }
              }
            )
            .subscribe();
        } catch (e) {
          console.warn("Realtime eventos_salvos subscribe falhou:", e);
        }

        try {
          participantsChannelRef.current = supabase
            .channel(`public:participantes:salvos_user_${userId}`)
            .on("postgres_changes", { event: "*", schema: "public", table: "participantes" }, async (payload: any) => {
              const changedEventId = String(payload.new?.evento_id ?? payload.old?.evento_id ?? "");
              if (!changedEventId) return;
              const isSaved = salvos.some((s) => s.eventoId === changedEventId);
              if (isSaved) {
                try {
                  const { count } = await supabase
                    .from("participantes")
                    .select("*", { head: true, count: "exact" })
                    .eq("evento_id", changedEventId);
                  setSalvos((prev) =>
                    prev.map((p) =>
                      p.eventoId === changedEventId ? { ...p, participantesTotais: count ?? p.participantesTotais } : p
                    )
                  );
                } catch (e) {
                  console.warn("Erro ao atualizar participantes para salvos:", e);
                }
              }
            })
            .subscribe();
        } catch (e) {
          console.warn("Realtime participantes subscribe falhou:", e);
        }
      } catch (err: any) {
        console.error("useEventosSalvosComParticipantes erro:", err);
        if (mounted) setErro(err instanceof Error ? err : new Error(String(err)));
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      try {
        if (channelRef.current) supabase.removeChannel(channelRef.current);
      } catch {}
      try {
        if (participantsChannelRef.current) supabase.removeChannel(participantsChannelRef.current);
      } catch {}
      eventsMapRef.current.clear();
    };
  }, [userIdParam]);

  return { salvos, loading, erro };
}
