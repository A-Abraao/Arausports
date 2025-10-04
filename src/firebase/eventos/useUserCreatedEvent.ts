import { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy as fbOrderBy,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../config";

export interface CreatedEvent {
  id: string;
  titulo: string;
  data: Date;
  local: string;
  participantesTotais: number;
  categoria?: string;
  horario?: string;
}

type Opts = {
  orderBy?: { field: string; direction?: "asc" | "desc" };
};

export function useUserCreatedEvents(userId: string | null, opts?: Opts) {
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [loadingCreated, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<Error | null>(null);

  const eventsMapRef = useRef<Map<string, Omit<CreatedEvent, "participantesTotais">>>(new Map());
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

    if (!userId) {
      eventsMapRef.current.clear();
      clearAllParticipantListeners();
      setCreatedEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const eventsColRef = collection(db, "usuarios", userId, "eventos");
    const baseQuery = query(eventsColRef, where("ownerUid", "==", userId));
    const finalQuery = opts?.orderBy
      ? query(baseQuery, fbOrderBy(opts.orderBy.field, opts.orderBy.direction ?? "asc"))
      : baseQuery;

    const unsubscribeEvents = onSnapshot(
      finalQuery,
      (snapshot) => {
        const currentIds = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const id = doc.id;
          currentIds.add(id);
          const raw = doc.data() as DocumentData;

          const titulo: string = raw.titulo ?? "";
          let dataVal: any = raw.data ?? raw.date ?? null;
          if (dataVal && typeof dataVal.toDate === "function") {
            dataVal = dataVal.toDate();
          } else if (typeof dataVal === "string") {
            const parsed = new Date(dataVal);
            if (!isNaN(parsed.getTime())) dataVal = parsed;
          }
          const data: Date = dataVal instanceof Date ? dataVal : new Date(0);

          const local: string = raw.local ?? "";
          const participantesAtuais: number = typeof raw.participantesAtuais === "number" ? raw.participantesAtuais : 0;
          const categoria: string = raw.categoria ?? raw.esporte ?? "";

          eventsMapRef.current.set(id, { id, titulo, data, local, categoria });

          if (!participantsUnsubRef.current.has(id)) {
            const participantesColRef = collection(db, "usuarios", userId, "eventos", id, "participantes");
            const unsubParticipants = onSnapshot(
              participantesColRef,
              (partsSnap) => {
                const count = partsSnap.size;
                participantsCountRef.current.set(id, count);
                rebuildAndSetEvents();
              },
              (err) => {
                console.error(`Erro ao escutar participantes do evento ${id}:`, err);
                participantsCountRef.current.set(id, participantesAtuais);
                rebuildAndSetEvents();
              }
            );

            participantsUnsubRef.current.set(id, unsubParticipants);
            participantsCountRef.current.set(id, participantesAtuais);
          } else {
            if (!participantsCountRef.current.has(id)) {
              participantsCountRef.current.set(id, participantesAtuais);
            }
          }
        });

        const toRemove: string[] = [];
        participantsUnsubRef.current.forEach((unsub, eventId) => {
          if (!currentIds.has(eventId)) {
            try { unsub(); } catch (e) {}
            toRemove.push(eventId);
          }
        });
        toRemove.forEach((rid) => {
          participantsUnsubRef.current.delete(rid);
          participantsCountRef.current.delete(rid);
          eventsMapRef.current.delete(rid);
        });

        rebuildAndSetEvents();
        setLoading(false);
      },
      (err) => {
        console.error("Erro no snapshot do useUserCreatedEvents:", err);
        setError(err);
        setLoading(false);
      }
    );

    function rebuildAndSetEvents() {
      const arr: CreatedEvent[] = [];
      eventsMapRef.current.forEach((base, id) => {
        const participantesTotais = participantsCountRef.current.get(id) ?? 0;
        arr.push({
          id,
          titulo: base.titulo,
          data: base.data,
          local: base.local,
          participantesTotais,
          categoria: base.categoria,
        });
      });

      arr.sort((a, b) => a.data.getTime() - b.data.getTime());

      setCreatedEvents(arr);
    }

    return () => {
      try { unsubscribeEvents(); } catch (e) {}
      clearAllParticipantListeners();
      eventsMapRef.current.clear();
      setCreatedEvents([]);
    };
  }, [userId, opts?.orderBy?.field, opts?.orderBy?.direction]);

  return { createdEvents, loadingCreated, error };
}
