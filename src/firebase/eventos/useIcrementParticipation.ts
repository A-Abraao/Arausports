
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, updateDoc, setDoc, increment, serverTimestamp, DocumentReference } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../config";
import type { FirebaseError } from "firebase/app";

type UseIcrementParticipationProps = {
  participacoes: number | null;
  loading: boolean;
  error: FirebaseError | Error | null;
  incrementParticipacoes: (by?: number) => Promise<void>;
  decrementParticipacoes: (by?: number) => Promise<void>;
  refetch: () => void;
};

export function useIcrementParticipation (
  userId?: string,
  collection = "usuarios",
  preventNegative = true
): UseIcrementParticipationProps {
  const [participacoes, setParticipacoes] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<FirebaseError | Error | null>(null);

  const docRef = useRef<DocumentReference<DocumentData> | null>(null);

  useEffect(() => {
    if (!userId) {
      setParticipacoes(null);
      setLoading(false);
      return;
    }

    docRef.current = doc(db, collection, userId);
    setLoading(true);
    setError(null);

    const unsub = onSnapshot(
      docRef.current,
      (snap) => {
        if (!snap.exists()) {
          setParticipacoes(0);
          setLoading(false);
          return;
        }
        const data = snap.data();
        const p = typeof data.participacoes === "number" ? data.participacoes : 0;
        setParticipacoes(p);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId, collection]);

  const changeParticipacoes = async (delta: number) => {
    if (!docRef.current) {
      setError(new Error("userId não fornecido"));
      return;
    }

    const prev = participacoes ?? 0;
    const tentative = prev + delta;

    if (preventNegative && tentative < 0) {
      setParticipacoes(0);
      return;
    }

    setParticipacoes(tentative);
    setLoading(true);
    setError(null);

    try {
      await updateDoc(docRef.current, {
        participacoes: increment(delta),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      try {
        await setDoc(
          docRef.current,
          {
            participacoes: tentative,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err2) {
        setParticipacoes(prev);
        setError(err2 as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  const incrementParticipacoes = async (by = 1) => {
    if (by <= 0) return changeParticipacoes(1);
    return changeParticipacoes(by);
  };

  const decrementParticipacoes = async (by = 1) => {
    if (by <= 0) return changeParticipacoes(-1); 
    return changeParticipacoes(-by);
  };

  const refetch = () => {
    if (!userId) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 200);
  };

  return {
    participacoes,
    loading,
    error,
    incrementParticipacoes,
    decrementParticipacoes,
    refetch,
  };
}
