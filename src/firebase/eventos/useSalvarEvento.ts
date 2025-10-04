import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config";
import { useAuth } from "../../contexts/AuthContext";

type SalvarPayload = {
  titulo: string;
  localizacao: string;
  data: any;
  participantesAtuais?: number;
  categoria?: string;
  ownerId?: string | null;
};

export function useSalvarEvento(eventoId: string | null) {
  const { firebaseUser } = useAuth();
  const [salvo, setSalvo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<Error | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser || !eventoId) {
      setSalvo(false);
      setSavedDocId(null);
      return;
    }

    const col = collection(db, "eventosSalvos");
    const q = query(
      col,
      where("eventoId", "==", eventoId),
      where("savedBy", "==", firebaseUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setSalvo(false);
          setSavedDocId(null);
        } else {
          setSalvo(true);
          setSavedDocId(snapshot.docs[0].id);
        }
      },
      (e) => {
        console.error("Erro ao escutar eventosSalvos:", e);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser, eventoId]);

  const salvarEvento = useCallback(
    async (payload?: SalvarPayload) => {
      if (!firebaseUser || !eventoId) return;
      if (!payload) {
        console.warn("salvarEvento: payload");
        return;
      }

      setLoading(true);
      setErro(null);

      try {
        const col = collection(db, "usuarios", firebaseUser.uid, "eventosSalvos");

        const q = query(
          col,
          where("eventoId", "==", eventoId),
          where("savedBy", "==", firebaseUser.uid)
        );
        const existing = await getDocs(q);
        if (!existing.empty) {
          setLoading(false);
          return;
        }

        await addDoc(col, {
          eventoId,
          titulo: payload.titulo,
          localizacao: payload.localizacao,
          data: payload.data,
          participantes: payload.participantesAtuais ?? 0,
          categoria: payload.categoria ?? "Evento",
          ownerUid: payload.ownerId ?? null, 
          savedBy: firebaseUser.uid, 
          createdAt: serverTimestamp(),
        });

      } catch (err) {
        console.error("Erro eo envriar os dados do evento pro firebase lá", err);
        setErro(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser, eventoId]
  );

  return { salvo, salvarEvento, loading, erro, savedDocId };
}
