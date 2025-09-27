import styled from "styled-components";
import { SecaoSuperior } from "./SecaoSuperior";
import { EsportesGrid } from "./EsportesGrid";
import { useState, useEffect } from "react";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

export const EsportesSectionComponent = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1.75em 2em;
  gap: 1.25em;
  margin-top: 1.40em;
`;

export type Evento = {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
  participantesAtuais?: number;
};

export function Esportes() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const eventosRef = collectionGroup(db, "eventos");
    const q = query(eventosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const arr: Evento[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Evento, "id">),
        }));
        setEventos(arr);
      },
      (err) => {
        console.error("Merrrda, não peguei o evento lá", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <EsportesSectionComponent>
      <SecaoSuperior count={eventos.length} />
      <EsportesGrid eventos={eventos} />
    </EsportesSectionComponent>
  );
}
