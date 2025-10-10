import styled from "styled-components";
import { Titulo } from "./Titulo";
import { InformacoesEvento } from "./InformacoesEvento";

export const EventoMarcadoComponent = styled.section`
  background: var(--gradient-secondary);
  border-radius: 0.5rem; /* antes 0.5em */
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: clamp(0.6rem, 1.4vw, 1rem);
  padding: clamp(0.9rem, 2.6vw, 2.25rem);
  overflow-wrap: break-word;
  width: 100%;
`;

export function EventoMarcado() {
  return (
    <EventoMarcadoComponent>
      <Titulo />
      <InformacoesEvento />
    </EventoMarcadoComponent>
  );
}
