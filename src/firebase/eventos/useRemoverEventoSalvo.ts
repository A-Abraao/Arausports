import { useState, useCallback } from "react";
import { doc, deleteDoc, query, collection, getDocs, where } from "firebase/firestore";
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
        const ref = doc(db, "usuarios", firebaseUser.uid, "eventosSalvos", savedDocId);

        await deleteDoc(ref);
        console.log("deleteDoc chamado em:", ref.path);
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

  const removerPorEventoId = useCallback(
    async (eventoId: string | null) => {
      if (!firebaseUser || !eventoId) return;
      setLoadingSalvo(true);
      setErro(null);
      try {
        const colRef = collection(db, "usuarios", firebaseUser.uid, "eventosSalvos");
        const q = query(colRef, where("eventoId", "==", eventoId));
        const snaps = await getDocs(q);
        const batchDeletes: Promise<void>[] = [];
        snaps.forEach(s => {
          const ref = doc(db, "usuarios", firebaseUser.uid, "eventosSalvos", s.id);
          batchDeletes.push(deleteDoc(ref));
          console.log("apagando doc encontrado:", ref.path);
        });
        await Promise.all(batchDeletes);
      } catch (e) {
        console.error("Erro ao remover por eventoId:", e);
        setErro(e as Error);
        throw e;
      } finally {
        setLoadingSalvo(false);
      }
    },
    [firebaseUser]
  );

  return { removerEvento, removerPorEventoId, loadingSalvo, erro };
}
