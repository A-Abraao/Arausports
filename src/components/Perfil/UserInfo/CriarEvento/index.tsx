// CriarEvento.jsx
import styled from "styled-components";
import { ButtonDeAcao } from "../EventoMarcado/MaisDetalhesButton";
import Textos from "./Textos";

const CriarEventoComponent = styled.div`
  background: #22c55e;
  border-radius: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: clamp(0.6rem, 1.6vw, 1rem);
  padding: clamp(0.9rem, 2.6vw, 2.25rem);
  width: 100%;

  /* Texto ocupa espaço; botão não deve ser empurrado */
  & > :first-child {
    flex: 1 1 auto;
    min-width: 0;
    max-width: calc(100% - 9rem);
  }

  /* botão: nunca full-width por padrão */
  & .MuiButton-root,
  & button[class*="MuiButton"] {
    width: auto !important;
    min-width: unset !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: clamp(0.28rem, 0.9vw, 0.5rem) clamp(0.6rem, 1.2vw, 0.9rem) !important;
    font-size: clamp(0.78rem, 1.6vw, 0.95rem) !important;
    margin-left: clamp(0.4rem, 1.2vw, 0.8rem);
    white-space: nowrap;
    box-sizing: border-box;
  }

  /* === MOBILE: texto 100% + botão abaixo alinhado à direita === */
  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
    gap: clamp(0.4rem, 2.2vw, 0.6rem);

    /* texto ocupa toda a largura e quebra normalmente */
    & > :first-child {
      width: 100%;
      max-width: 100%;
      margin-bottom: 0.4rem;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    /* botão fica em nova linha, alinhado à direita, tamanho controlado */
    & .MuiButton-root,
    & button[class*="MuiButton"] {
      width: auto !important;
      min-width: 5rem !important; /* coerente com seu sx xs */
      align-self: flex-end;       /* alinha à extrema direita */
      margin-left: 0;
      padding: 0.22rem 0.5rem !important;
      font-size: 0.75rem !important;
      white-space: normal !important;
    }
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
