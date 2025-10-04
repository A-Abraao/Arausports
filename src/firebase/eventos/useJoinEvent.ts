import { useState, } from "react";
import { doc, runTransaction, increment } from "firebase/firestore";
import { db } from "../config";

export function useJoinEvent() {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState<Error | null>(null)

    const joinEvent = async(eventoId:string, ownerId:string, participanteId:string) => {
        setLoading(true)
        setError(null)

    try {
      const eventoRef = doc(db, "usuarios", ownerId, "eventos", eventoId);
      const participanteRef = doc(db, "usuarios", ownerId, "eventos", eventoId, "participantes", participanteId);

      await runTransaction(db, async (tx) => {
        const eventoSnap = await tx.get(eventoRef);
        if (!eventoSnap.exists()) throw new Error("Que evento é esse?");

        const eventoData = eventoSnap.data() as any;
        const capacidade = Number(eventoData.capacidade ?? 0);
        const participantesAtuais = Number(eventoData.participantesAtuais ?? 0);

        if (capacidade <= 0) throw new Error("Capacidade está errada");
        if (participantesAtuais >= capacidade) throw new Error("Lotou esse evento");

        const participanteSnap = await tx.get(participanteRef);
        if (participanteSnap.exists()) throw new Error("Você já está inscrito nesse evento.");

        tx.update(eventoRef, { participantesAtuais: increment(1) });
        tx.set(participanteRef, { userId: participanteId, joinedAt: new Date().toISOString() });
      });
    } catch (err: any) {
      setError(err.message ?? "Não consegui colocar você no evento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { joinEvent, loading, error };
}


