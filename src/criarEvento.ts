import { doc, collection, addDoc } from "firebase/firestore";
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
  
  const userDocRef = doc(db, "users", uid);
  
  const eventosColRef = collection(userDocRef, "eventos");
  
  const docRef = await addDoc(eventosColRef, {
    titulo: eventData.titulo,
    categoria: eventData.categoria,
    data: eventData.data,
    horario: eventData.horario,
    local: eventData.local,
    capacidade: eventData.capacidade,
    createdAt: new Date().toISOString()
  });
  return docRef.id; 
};
