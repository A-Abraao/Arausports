import { useState, useCallback } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config";
import { useAuth } from "../../contexts/AuthContext";

export function useRemoverEventoSalvo() {
  const { firebaseUser } = useAuth();
  const [loadingSalvo, setLoadingSalvo] = useState(false);
  const [erro, setErro] = useState<Error | null>(null);

  const removerEvento = useCallback(
    async (savedDocId: string | null) => {
      if (!firebaseUser || !savedDocId) return;
      setLoadingSalvo(true);
      setErro(null);

      try {
        const ref = doc(db, "eventosSalvos", savedDocId);
        await deleteDoc(ref);
      } catch (e) {
        console.error("Erro ao remover evento salvo:", e);
        setErro(e as Error);
        throw e;
      } finally {
        setLoadingSalvo(false);
      }
    },
    [firebaseUser]
  );

  return { removerEvento, loadingSalvo, erro };
}
