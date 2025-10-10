import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
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

    const colRef = collection(db, "usuarios", firebaseUser.uid, "eventosSalvos");
    
    const q = query(colRef, where("eventoId", "==", eventoId));

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
        console.warn("salvarEvento: payload ausente.");
        return;
      }

      if (salvo) {
          console.log("Evento já está salvo. Ignorando a tentativa de salvar novamente.");
          return;
      }

      setLoading(true);
      setErro(null);

      try {
        const colRef = collection(db, "usuarios", firebaseUser.uid, "eventosSalvos");
        
        await addDoc(colRef, {
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
        console.error("Erro ao processar dados do evento no Firebase:", err);
        setErro(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser, eventoId, salvo] 
  );

  return { salvo, setSalvo ,salvarEvento, loading, erro, savedDocId };
}