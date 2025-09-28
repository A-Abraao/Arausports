import { db } from "./firebase";
import { collection, doc, runTransaction } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

type Evento = {
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
  imageUrl?: string;  
};

export const addEventForUser = async (uid: string, evento: Evento) => {
  const eventosColRef = collection(db, "users", uid, "eventos");
  const newEventRef = doc(eventosColRef);
  const id = newEventRef.id;

  const capacidadeValida = Math.max(1, Number(evento.capacidade ?? 1));

  const payload: any = {
    ...evento,
    id,
    ownerUid: uid,
    capacidade: capacidadeValida,
    participantesAtuais: 1,
    createdAt: Timestamp.now(), 
    data: Timestamp.fromDate(new Date(evento.data)), 
    userEventPath: `users/${uid}/eventos/${id}`,
  };

  const participanteRef = doc(db, "users", uid, "eventos", id, "participantes", uid);

  await runTransaction(db, async (tx) => {
    tx.set(newEventRef, payload);
    tx.set(participanteRef, {
      userId: uid,
      joinedAt: new Date().toISOString(),
    });
  });

  return id;
};
