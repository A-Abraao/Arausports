import styled from "styled-components";
import { SecaoSuperior } from "./SecaoSuperior";
import { EsportesGrid } from "./EsportesGrid";
import { useState, useEffect, useMemo } from "react";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

export const EsportesSectionComponent = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-top: 1px solid rgba(105, 105, 105, 0.2);
  padding: 1.75em 2em;
  gap: 1.25em;
  margin-top: 3.5em;
`;

export type Evento = {
  id: string;
  ownerId?: string;
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
  participantesAtuais?: number;
};

type Props = {
  searchQuery?: string; 
};

export function Esportes({ searchQuery = "" }: Props) {
  const [eventosInternos, setEventosInternos] = useState<Evento[]>([]);

  useEffect(() => {
    const eventosRef = collectionGroup(db, "eventos");
    const q = query(eventosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr: Evento[] = snapshot.docs.map((d) => {
        const ownerId = d.ref.parent.parent?.id ?? undefined;
        return {
          id: d.id,
          ownerId,
          ...(d.data() as Omit<Evento, "id" | "ownerId">),
        };
      });
      setEventosInternos(arr);
    });

    return () => unsubscribe();
  }, []);

  const normalizeText = (s: string) =>
    s
      .normalize?.("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const eventosFiltrados = useMemo(() => {
    const q = (searchQuery ?? "").trim();
    if (!q) return eventosInternos;

    const tokens = q
      .split(/\s+/)
      .map((t) =>
        normalizeText(t)
      )
      .filter(Boolean);

    if (tokens.length === 0) return eventosInternos;

    return eventosInternos.filter((evt) => {
      const titulo = normalizeText(evt.titulo ?? "");
      const local = normalizeText(evt.local ?? "");
      const combined = `${titulo} ${local}`;

      return tokens.every((token) => combined.includes(token));
    });
  }, [eventosInternos, searchQuery]);

  return (
    <EsportesSectionComponent>
      <SecaoSuperior count={eventosFiltrados.length} />
      <EsportesGrid eventos={eventosFiltrados} />
    </EsportesSectionComponent>
  );
}
