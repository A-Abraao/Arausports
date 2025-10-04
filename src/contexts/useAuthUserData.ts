import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export type AuthUserData = {
  nome: string;
  bio: string;
  photo: string;
} | null;

export function useAuthUserData(userId: string | null) {
  const [userData, setUserData] = useState<AuthUserData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const { nome, bio, photo } = snap.data();
          setUserData({ nome, bio, photo } as AuthUserData);
        } else {
          setUserData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { userData, loading, error };
}
