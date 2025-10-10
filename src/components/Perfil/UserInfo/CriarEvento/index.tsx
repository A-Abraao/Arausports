import styled from "styled-components";
import { ButtonDeAcao } from "../EventoMarcado/MaisDetalhesButton";
import Textos from "./Textos";

const CriarEventoComponent = styled.div`
  background: springgreen;
  border-radius: 0.5rem; /* 0.5em -> 0.5rem */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: clamp(0.6rem, 1.6vw, 1rem);
  padding: clamp(0.9rem, 2.6vw, 2.25rem);
  width: 100%;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export function CriarEvento() {
  return (
    <CriarEventoComponent>
      <Textos />
      <ButtonDeAcao>Criar evento</ButtonDeAcao>
    </CriarEventoComponent>
  );
}
