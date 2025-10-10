import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import type { DocumentData, Unsubscribe } from "firebase/firestore";
import { db } from "../config";
import { useAuth } from "../../contexts/AuthContext";

type SalvoItem = {
  savedId: string;
  eventoId?: string;
  ownerUid?: string;
  titulo?: string;
  localizacao?: string;
  data?: any;
  categoria?: string;
  participantes?: number;
  participantesTotais?: number; 
  [k: string]: any;
};

export function useEventosSalvosComParticipantes(userIdParam?: string | null) {
  const { firebaseUser } = useAuth();
  const userId = userIdParam ?? firebaseUser?.uid ?? null;

  const [salvos, setSalvos] = useState<SalvoItem[]>([]);
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

    let unsubEventListeners: Unsubscribe[] = [];

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        unsubEventListeners.forEach((u) => u());
        unsubEventListeners = [];

        const base: SalvoItem[] = snap.docs.map((d) => {
          const data = d.data() as DocumentData;
          return {
            savedId: d.id,
            eventoId: data.eventoId ?? undefined,
            ownerUid: data.ownerUid ?? data.ownerId ?? undefined,
            titulo: data.titulo,
            localizacao: data.localizacao,
            data: data.data,
            categoria: data.categoria,
            participantes: data.participantes ?? data.participantesAtuais ?? 0,
            participantesTotais: data.participantes ?? data.participantesAtuais ?? 0,
            ...data,
          };
        });

        setSalvos(base);
        setLoading(false);

        base.forEach((item) => {
          const owner = item.ownerUid;
          const eventoId = item.eventoId;
          if (!owner || !eventoId) return;

          const eventDocRef = doc(db, "usuarios", owner, "eventos", eventoId);
          const unsubEv = onSnapshot(
            eventDocRef,
            (evSnap) => {
              if (!evSnap.exists()) return;
              const evData = evSnap.data() as DocumentData;

              const participantesAtualizados =
                evData.participantesAtuais ?? evData.participantes ?? item.participantesTotais ?? 0;

              setSalvos((prev) =>
                prev.map((p) =>
                  p.savedId === item.savedId
                    ? { ...p, participantesTotais: participantesAtualizados }
                    : p
                )
              );
            },
            (err) => {
              console.error("Erro no onSnapshot do evento original:", err);
            }
          );

          unsubEventListeners.push(unsubEv);
        });
      },
      (e) => {
        console.error("onSnapshot eventosSalvos error:", e);
        setErro(e as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      unsubEventListeners.forEach((u) => u());
      unsubEventListeners = [];
    };
  }, [userId]);

  return { salvos, loading, erro };
}
