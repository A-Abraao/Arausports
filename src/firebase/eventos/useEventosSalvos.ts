import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config";
import { useAuth } from "../../contexts/AuthContext";

export function useEventosSalvosComParticipantes(userIdParam?: string | null) {
  const { firebaseUser } = useAuth();
  const userId = userIdParam ?? firebaseUser?.uid ?? null;

  const [salvos, setSalvos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setSalvos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);

    const col = collection(db, "usuarios", userId, "eventosSalvos");
    const q = query(col, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map(d => ({
          savedId: d.id,
          ...d.data()
        }));
        setSalvos(arr);
        setLoading(false);
      },
      (e) => {
        console.error("onSnapshot eventosSalvos error:", e);
        setErro(e as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { salvos, loading, erro };
}
