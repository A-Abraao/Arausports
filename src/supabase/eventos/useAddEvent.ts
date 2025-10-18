import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";

export type NewEventPayload = {
  titulo: string;
  categoria?: string;
  data: string;
  horario?: string;
  local: string;
  capacidade: number;
};

export function useAddEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  const incrementEventosCriadosFallback = async (ownerId: string) => {
    const { data: userRow, error: selErr } = await supabase
      .from("usuarios")
      .select("eventos_criados")
      .eq("id", ownerId)
      .maybeSingle();

    if (selErr) throw selErr;

    const current = Number(userRow?.eventos_criados ?? 0);
    const next = Math.max(0, current + 1);

    const { error: updErr } = await supabase
      .from("usuarios")
      .update({ eventos_criados: next })
      .eq("id", ownerId);

    if (updErr) throw updErr;
  };

  const callIncrementRpc = async (ownerId: string) => {
    try {
      const { error: rpcErr } = await supabase.rpc("increment_eventos_criados", { uid: ownerId } as any);
      if (rpcErr) throw rpcErr;
    } catch (err) {
      throw err;
    }
  };

  const addEventForUser = useCallback(async (ownerId: string | null, evento: NewEventPayload) => {
    if (!ownerId) throw new Error("Usuário não autenticado.");

    setLoading(true);
    setError(null);
    setEventId(null);

    try {
      const capacidadeValida = Math.max(1, Number(evento.capacidade ?? 1));
      const eventDate = evento.data ? new Date(evento.data) : null;
      if (!eventDate || isNaN(eventDate.getTime())) {
        throw new Error("Data do evento inválida.");
      }

      const eventRow = {
        owner_id: ownerId,
        titulo: evento.titulo ?? "",
        categoria: evento.categoria ?? null,
        data: eventDate.toISOString(),
        horario: evento.horario ?? null,
        local: evento.local ?? "",
        capacidade: capacidadeValida,
        created_at: new Date().toISOString(),
        participantes_totais: 1,
      };

      const { data: insertedEvents, error: insertErr } = await supabase
        .from("eventos")
        .insert([eventRow])
        .select("id")
        .maybeSingle();

      if (insertErr) throw insertErr;
      if (!insertedEvents || !insertedEvents.id) {
        throw new Error("Falha ao criar evento (id ausente).");
      }

      const newEventId = String(insertedEvents.id);

      const participantRow = {
        evento_id: newEventId,
        user_id: ownerId,
        joined_at: new Date().toISOString(),
      };

      const { error: partErr } = await supabase.from("participantes").insert([participantRow]);
      if (partErr) {
        await supabase.from("eventos").delete().eq("id", newEventId);
        throw partErr;
      }

      try {
        await callIncrementRpc(ownerId);
      } catch (rpcErr) {
        try {
          await incrementEventosCriadosFallback(ownerId);
        } catch (fallbackErr) {
          console.warn("Não foi possível incrementar eventos_criados:", fallbackErr);
        }
      }

      setEventId(newEventId);
      setLoading(false);
      return newEventId;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  }, []);

  return { addEventForUser, loading, error, eventId };
}
