import { useState, useCallback } from "react";
import { db } from "../config";
import {
  collection,
  doc,
  runTransaction,
  Timestamp,
  increment,
} from "firebase/firestore";

type Evento = {
  titulo: string;
  categoria: string;
  data: string; // string vindo do form (ex: "2025-10-05")
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

      // validação simples da data
      const eventDate = evento.data ? new Date(evento.data) : null;
      if (!eventDate || isNaN(eventDate.getTime())) {
        throw new Error("Data do evento inválida");
      }

      // payload
      const payload: any = {
        ...evento,
        id,
        ownerUid: uid,
        capacidade: capacidadeValida,
        participantesAtuais: 1,
        createdAt: Timestamp.now(),
        data: Timestamp.fromDate(eventDate),
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

      // referencia do documento do usuário
      const userDocRef = doc(db, "usuarios", uid);

      await runTransaction(db, async (tx) => {
        const userSnap = await tx.get(userDocRef);

        tx.set(newEventRef, payload);

        // adiciona o participante
        tx.set(participanteRef, {
          userId: uid,
          joinedAt: new Date().toISOString(),
        });

        if (userSnap.exists()) {
          tx.update(userDocRef, { eventosCriados: increment(1) });
        } else {
          tx.set(userDocRef, { eventosCriados: 1 }, { merge: true });
        }
      });

      setEventId(id);
      return id;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addEventForUser, loading, error, eventId };
}
