import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

type Evento = {
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
  imageUrl?: string;
  imagePath?: string;
};

export const addEventForUser = async (uid: string, evento: Evento) => {
  // cria documento com id automático na sub-collection users/{uid}/eventos
  const eventosColRef = collection(db, "users", uid, "eventos");
  const newEventRef = doc(eventosColRef); // doc() sem id gera id automático
  const id = newEventRef.id;

  const payload = {
    ...evento,
    id,
    ownerUid: uid,
    createdAt: new Date().toISOString(),
    userEventPath: `users/${uid}/eventos/${id}`,
  };

  await setDoc(newEventRef, payload);

  return id;
};
