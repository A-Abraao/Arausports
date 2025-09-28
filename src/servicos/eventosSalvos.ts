import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export type SavedEventShort = {
  id: string;
  ownerId: string;
  titulo?: string | null;
  categoria?: string | null;
  local?: string | null;
  data?: string | null;
  capacidade?: number | null;
  salvoEm?: string | null;
};

export const saveEventForUser = async (userUid: string, evento: SavedEventShort) => {
  if (!userUid) throw new Error("Usuário não autenticado.");
  const ref = doc(db, "users", userUid, "eventosSalvos", evento.id);
  await setDoc(ref, {
    ownerId: evento.ownerId,
    titulo: evento.titulo ?? null,
    categoria: evento.categoria ?? null,
    local: evento.local ?? null,
    data: evento.data ?? null,
    capacidade: evento.capacidade ?? null,
    salvoEm: new Date().toISOString(),
  });
};

export const removeSavedEventForUser = async (userUid: string, eventoId: string) => {
  if (!userUid) throw new Error("Usuário não autenticado.");
  const ref = doc(db, "users", userUid, "eventosSalvos", eventoId);
  await deleteDoc(ref);
};

export const isEventSavedForUser = async (userUid: string, eventoId: string) => {
  if (!userUid) return false;
  const ref = doc(db, "users", userUid, "eventosSalvos", eventoId);
  const snap = await getDoc(ref);
  return snap.exists();
};

export const subscribeToSavedEvents = (
  userUid: string,
  onUpdate: (saved: SavedEventShort[]) => void
) => {
  if (!userUid) {
    onUpdate([]);
    return () => {};
  }
  const col = collection(db, "users", userUid, "eventosSalvos");
  const q = query(col, orderBy("salvoEm", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const arr: SavedEventShort[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    onUpdate(arr);
  });
  return unsub;
};
