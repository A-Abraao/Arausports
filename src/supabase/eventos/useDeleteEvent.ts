import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrementEventosCriadosFallback = async (ownerId: string) => {

    try {
      const { data: userRow, error: selectErr } = await supabase
        .from("usuarios")
        .select("eventos_criados")
        .eq("id", ownerId)
        .maybeSingle();

      if (selectErr) throw selectErr;

      const current = (userRow?.eventos_criados ?? 0) as number;
      const newVal = Math.max(0, Number(current) - 1);

      const { error: updateErr } = await supabase
        .from("usuarios")
        .update({ eventos_criados: newVal })
        .eq("id", ownerId);

      if (updateErr) throw updateErr;
    } catch (err) {
      throw err;
    }
  };

  const callDecrementRpc = async (ownerId: string) => {
    try {
      const { error: rpcErr } = await supabase.rpc("decrement_eventos_criados", {
        uid: ownerId,
      } as any);
      if (rpcErr) throw rpcErr;
    } catch (err) {
      throw err;
    }
  };

  const deleteEvent = useCallback(async (ownerId: string | null, eventId: string | null) => {
    if (!ownerId || !eventId) {
      throw new Error("ownerId e eventId são obrigatórios para deletar um evento.");
    }

    setLoading(true);
    setError(null);

    try {
      const { error: pErr } = await supabase.from("participantes").delete().eq("evento_id", eventId);
      if (pErr) throw pErr;

      const { error: sErr } = await supabase.from("eventos_salvos").delete().eq("evento_id", eventId);
      if (sErr) throw sErr;

      const { error: eErr } = await supabase.from("eventos").delete().match({ id: eventId, owner_id: ownerId });
      if (eErr) throw eErr;

      try {
        await callDecrementRpc(ownerId);
      } catch (rpcErr) {
        console.warn("RPC decrement_eventos_criados falhou, tentando fallback:", rpcErr);
        try {
          await decrementEventosCriadosFallback(ownerId);
        } catch (fallbackErr) {
          console.warn("Fallback para decrementar eventos_criados falhou:", fallbackErr);
        }
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Erro ao deletar evento:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  }, []);

  return { deleteEvent, loading, error };
}
