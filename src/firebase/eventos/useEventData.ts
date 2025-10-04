import { useEffect, useState } from "react";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config";

export type Evento = {
  id: string;
  ownerId?: string;
  titulo: string;
  categoria: string;
  data: any;
  horario: string;
  local: string;
  capacidade: number;
  participantesAtuais?: number;
  imageUrl?: string;
};

export function useEventData() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventosRef = collectionGroup(db, "eventos");
    const q = query(eventosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr: Evento[] = snapshot.docs.map((d) => {
        const ownerId = d.ref.parent.parent?.id ?? undefined;
        return {
          id: d.id,
          ownerId,
          ...(d.data() as Omit<Evento, "id" | "ownerId">),
        };
      });
      setEventos(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { eventos, loading };
}

