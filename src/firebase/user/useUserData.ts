import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config";

export type UserDataProfile = {
  displayName: string | null;
  bio: string | null;
  photoURL: string | null;
  email: string | null;
  eventosCriados: number | 0
  participacoes: number | 0
  conexoes: number | 0
};

export function useUserData(userId: string | null) {
  const [userData, setUserData] = useState<UserDataProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userRef = doc(db, "usuarios", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          const displayName = data.displayName ?? null;
          const bio = data.bio ?? null;
          const photoURL = data.photoURL ?? null;
          const email = data.email ?? null;
          const eventosCriados = data.eventosCriados ?? 0
          const participacoes = data.participacoes ?? 0
          const conexoes = data.conexoes ?? 0

          setUserData({ displayName, bio, photoURL, email, eventosCriados, participacoes, conexoes });
        } else {
          setUserData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("useUserData onSnapshot error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { userData, loading, error };
}
