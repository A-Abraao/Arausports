import { useState, useCallback } from "react";
import { doc, collection, collectionGroup, query, where, getDocs, writeBatch, updateDoc, increment } from "firebase/firestore";
import { db } from "../config";

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  };

  const deleteEvent = useCallback(
    async (ownerId: string | null, eventId: string | null) => {
      if (!ownerId || !eventId) {
        throw new Error("ownerId e eventId são obrigatórios para deletar um evento.");
      }

      setLoading(true);
      setError(null);

      try {
        const eventRef = doc(db, "usuarios", ownerId, "eventos", eventId);

        const participantsCol = collection(db, "usuarios", ownerId, "eventos", eventId, "participantes");
        const participantsSnap = await getDocs(participantsCol);
        const participantsRefs = participantsSnap.docs.map((d) => d.ref);

        let savedRefs: any[] = [];
        try {
          const savedQ = query(collectionGroup(db, "eventosSalvos"), where("eventoId", "==", eventId));
          const savedSnap = await getDocs(savedQ);
          savedRefs = savedSnap.docs.map((d) => d.ref);
        } catch (innerErr: any) {
          const msg = String(innerErr?.message ?? innerErr).toLowerCase();
          const needsIndex = msg.includes("collection_group") || msg.includes("requires a collection_group") || msg.includes("index");
          console.warn("collectionGroup query falhou (provável motivo: índice ausente). Fallback ativado.", innerErr);

          if (needsIndex) {
            const usuariosCol = collection(db, "usuarios");
            const usuariosSnap = await getDocs(usuariosCol);
            const candidateSavedRefs: any[] = [];

            for (const u of usuariosSnap.docs) {
              try {
                const uid = u.id;
                const col = collection(db, "usuarios", uid, "eventosSalvos");
                const q = query(col, where("eventoId", "==", eventId));
                const snaps = await getDocs(q);
                snaps.forEach((s) => candidateSavedRefs.push(s.ref));
              } catch (qErr) {
                console.error("Erro ao checar eventosSalvos do usuário", u.id, qErr);
              }
            }

            savedRefs = candidateSavedRefs;
          } else {
            throw innerErr;
          }
        }

        const allRefsToDelete = [...participantsRefs, ...savedRefs, eventRef];

        const CHUNK_SIZE = 400;
        const chunks = chunkArray(allRefsToDelete, CHUNK_SIZE);

        for (const chunk of chunks) {
          const batch = writeBatch(db);
          chunk.forEach((r) => batch.delete(r));
          await batch.commit();
        }

        try {
          const userDocRef = doc(db, "usuarios", ownerId);
          await updateDoc(userDocRef, { eventosCriados: increment(-1) });
        } catch (e) {
          console.warn("Não foi possível decrementar eventosCriados (talvez não exista).", e);
        }

        setLoading(false);
        return true;
      } catch (err: any) {
        console.error("Erro ao deletar evento:", err);
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setLoading(false);
        throw e;
      }
    },
    []
  );

  return { deleteEvent, loading, error };
}
