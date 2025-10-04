import { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  CollectionReference,
} from "firebase/firestore";
import { db } from "../config";
import { useAuth } from "../../contexts/AuthContext";

export type EventoSalvoComContagem = {
  id: string;
  eventoId?: string;
  titulo?: string;
  data?: any;
  localizacao?: string;
  categoria?: string;
  ownerUid?: string;
  participantesTotais: number;
  createdAt?: any;
};

export function useEventosSalvosComParticipantes() {
  const { firebaseUser } = useAuth();
  const [salvos, setSalvos] = useState<EventoSalvoComContagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const salvosMapRef = useRef<Map<string, Omit<EventoSalvoComContagem, "participantesTotais">>>(new Map());
  const participantsUnsubRef = useRef<Map<string, () => void>>(new Map());
  const participantsCountRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const clearAllParticipantListeners = () => {
      participantsUnsubRef.current.forEach((unsub) => {
        try { unsub(); } catch (e) {}
      });
      participantsUnsubRef.current.clear();
      participantsCountRef.current.clear();
    };

    if (!firebaseUser) {
      salvosMapRef.current.clear();
      clearAllParticipantListeners();
      setSalvos([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const col = collection(db, "usuarios", firebaseUser.uid, "eventosSalvos");
    const q = query(col);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const currentSavedIds = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const id = doc.id;
          currentSavedIds.add(id);

          const raw = doc.data() as DocumentData;

          const titulo: string = raw.titulo ?? "";
          let dataVal: any = raw.data ?? raw.date ?? null;
          if (dataVal && typeof dataVal?.toDate === "function") {
            dataVal = dataVal.toDate();
          } else if (typeof dataVal === "string") {
            const parsed = new Date(dataVal);
            if (!isNaN(parsed.getTime())) dataVal = parsed;
          }
          const data: Date = dataVal instanceof Date ? dataVal : new Date(0);

          const localizacao: string = raw.localizacao ?? raw.local ?? "";
          const categoria: string = raw.categoria ?? "";
          const ownerUid: string | undefined = raw.ownerUid ?? raw.ownerId ?? undefined;
          const eventoId: string | undefined = raw.eventoId ?? undefined;
          const createdAt = raw.createdAt ?? null;

          salvosMapRef.current.set(id, {
            id,
            eventoId,
            titulo,
            data,
            localizacao,
            categoria,
            ownerUid,
            createdAt,
          });

          const participantsKey = `${ownerUid ?? "unknown"}__${eventoId ?? id}`;

          if (ownerUid && eventoId && !participantsUnsubRef.current.has(participantsKey)) {
            try {
              const participantesColRef = collection(
                db,
                "usuarios",
                ownerUid,
                "eventos",
                eventoId,
                "participantes"
              ) as CollectionReference;
              const unsubParts = onSnapshot(
                participantesColRef,
                (partsSnap) => {
                  const count = partsSnap.size;
                  participantsCountRef.current.set(participantsKey, count);
                  rebuildAndSetSalvos();
                },
                (err) => {
                  console.error("Erro ao escutar participantes para evento salvo:", err);
                  participantsCountRef.current.set(participantsKey, 0);
                  rebuildAndSetSalvos();
                }
              );
              participantsUnsubRef.current.set(participantsKey, unsubParts);
              participantsCountRef.current.set(participantsKey, 0);
            } catch (e) {
              console.error("Erro criando listener de participantes (evento salvo):", e);
              participantsCountRef.current.set(participantsKey, 0);
            }
          } else {
            if (!participantsCountRef.current.has(participantsKey)) {
              const participantesField = typeof raw.participantes === "number" ? raw.participantes : 0;
              participantsCountRef.current.set(participantsKey, participantesField);
            }
          }
        });

        const toRemove: string[] = [];
        participantsUnsubRef.current.forEach((unsub, participantsKey) => {
          const anyMatch = Array.from(salvosMapRef.current.keys()).some((savedId) => {
            const base = salvosMapRef.current.get(savedId);
            if (!base) return false;
            const key = `${base.ownerUid ?? "unknown"}__${base.eventoId ?? savedId}`;
            return key === participantsKey;
          });
          if (!anyMatch) {
            try { unsub(); } catch (e) {}
            toRemove.push(participantsKey);
          }
        });
        toRemove.forEach((k) => {
          participantsUnsubRef.current.delete(k);
          participantsCountRef.current.delete(k);
        });

        rebuildAndSetSalvos();
        setLoading(false);
      },
      (err) => {
        console.error("Erro no snapshot de eventosSalvos:", err);
        setError(err);
        setLoading(false);
      }
    );

    function rebuildAndSetSalvos() {
      const arr: EventoSalvoComContagem[] = [];
      salvosMapRef.current.forEach((base, savedId) => {
        const key = `${base.ownerUid ?? "unknown"}__${base.eventoId ?? savedId}`;
        const participantesTotais = participantsCountRef.current.get(key) ?? 0;
        arr.push({
          id: savedId,
          eventoId: base.eventoId,
          titulo: base.titulo,
          data: base.data,
          localizacao: base.localizacao,
          categoria: base.categoria,
          ownerUid: base.ownerUid,
          participantesTotais,
          createdAt: base.createdAt,
        });
      });

      arr.sort((a, b) => {
        const ta = a.createdAt ? a.createdAt?.toMillis?.() ?? 0 : (a.data instanceof Date ? a.data.getTime() : 0);
        const tb = b.createdAt ? b.createdAt?.toMillis?.() ?? 0 : (b.data instanceof Date ? b.data.getTime() : 0);
        return tb - ta;
      });

      setSalvos(arr);
    }

    return () => {
      try { unsubscribe(); } catch (e) {}
      clearAllParticipantListeners();
      salvosMapRef.current.clear();
      setSalvos([]);
    };
  }, [firebaseUser]);

  return { salvos, loading, error };
}
