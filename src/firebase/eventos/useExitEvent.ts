import { useState } from "react";
import { doc, runTransaction, increment } from "firebase/firestore";
import { db } from "../config";

export function useExitEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exitEvent = async (eventoId: string, ownerId: string, participantId: string) => {
    setLoading(true);
    setError(null);

    try {
      const eventoRef = doc(db, "usuarios", ownerId, "eventos", eventoId);
      const participanteRef = doc(db, "usuarios", ownerId, "eventos", eventoId, "participantes", participantId);

      await runTransaction(db, async (tx) => {
        const eventoSnap = await tx.get(eventoRef);
        if (!eventoSnap.exists()) throw new Error("Esse evento não existe.");

        const participanteSnap = await tx.get(participanteRef);
        if (!participanteSnap.exists()) throw new Error("Você não está inscrito nesse evento.");

        tx.update(eventoRef, { participantesAtuais: increment(-1) });
        tx.delete(participanteRef);
      });
    } catch (err: any) {
      setError(err.message ?? "Deu ruim quando fui te tirar do evento lá");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { exitEvent, loading, error };
}
