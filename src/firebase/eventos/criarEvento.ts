import { useState, useCallback } from "react";
import { db } from "../config";
import { collection, doc, runTransaction, Timestamp } from "firebase/firestore";

type Evento = {
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
  imageUrl?: string;  
};

export function useAddEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  const addEventForUser = useCallback(async (uid: string, evento: Evento) => {
    setLoading(true);
    setError(null);
    setEventId(null);

    try {
      // referencia do caminho para criar o evento
      const eventosColRef = collection(db, "usuarios", uid, "eventos");
      const newEventRef = doc(eventosColRef);

      // id do evento para podermos acessar ele depois
      const id = newEventRef.id;

      const capacidadeValida = Math.max(1, Number(evento.capacidade ?? 1));

      // payload
      const payload: any = {
        ...evento,
        id,
        ownerUid: uid,
        capacidade: capacidadeValida,
        participantesAtuais: 1,
        createdAt: Timestamp.now(),
        data: Timestamp.fromDate(new Date(evento.data)),
        userEventPath: `usuarios/${uid}/eventos/${id}`,
        foiSalvo: false,
      };

      // referencia da coleção de participantes
      const participanteRef = doc(
        db,
        "usuarios",
        uid,
        "eventos",
        id,
        "participantes",
        uid
      );

      // criar o evento de fato
      await runTransaction(db, async (tx) => {
        tx.set(newEventRef, payload);
        tx.set(participanteRef, {
          userId: uid,
          joinedAt: new Date().toISOString(),
        });
      });

      setEventId(id);
      return id;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { addEventForUser, loading, error, eventId };
}
