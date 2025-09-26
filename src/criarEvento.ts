import { doc, collection, addDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addEventForUser = async (
  uid: string,
  eventData: {
    titulo: string;
    categoria: string;
    data: string;
    horario: string;
    local: string;
    capacidade: number;
  }
) => {
  
  const userEventsRef = collection(db, "users", uid, "eventos");
  const userDocRef = await addDoc(userEventsRef, {
    ...eventData,
    createdAt: new Date().toISOString(),
    ownerUid: uid,
  });

  const eventId = userDocRef.id;

  const publicEventRef = doc(db, "eventos", eventId);
  await setDoc(publicEventRef, {
    id: eventId,
    ...eventData,
    createdAt: new Date().toISOString(),
    ownerUid: uid,
    userEventPath: `users/${uid}/eventos/${eventId}`, 
  });

  return eventId;
};
