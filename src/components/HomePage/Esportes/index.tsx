import styled from "styled-components";
import { SecaoSuperior } from "./SecaoSuperior";
import { EsportesGrid } from "./EsportesGrid";
import { useEventData } from "../../../firebase";

export const EsportesSectionComponent = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-top: 1px solid rgba(105, 105, 105, 0.2);
  padding: 1.75em 2em;
  gap: 1.25em;
  margin-top: 3.5em;
  
  .h2 {
    color: var(--muted-foreground);
  }
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
  searchQuery: string;
};

export function Esportes({ searchQuery }: Props) {
  const { eventos, loading } = useEventData();

  if (loading) return <h2 className="crregando">procurando...</h2>;

  const eventosFiltrados = eventos.filter((evento) => {
    const termo = searchQuery.toLowerCase();
    return (
      evento.titulo.toLowerCase().includes(termo) ||
      evento.local.toLowerCase().includes(termo)
    );
  });

  return (
    <EsportesSectionComponent>
      <SecaoSuperior count={eventosFiltrados.length} />
      <EsportesGrid eventos={eventosFiltrados} />
    </EsportesSectionComponent>
  );
}
