import styled from "styled-components";

//componente crado peli styked
const InformacoesEventoComponent = styled.div`
  display: flex;
  align-items: flex-end;
  gap: clamp(0.6rem, 1.2vw, 1rem);

  .divEncapsuladora {
    display: flex;
    flex-direction: column;
    gap: clamp(0.45rem, 1.0vw, 0.75rem);
    flex: 1;
    min-width: 0;
  }

  /* Para telas muito pequenas empilha e alinha ao início */
  @media (max-width: 420px) {
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(0.4rem, 2.2vw, 0.6rem);
  }
`;

/* Texto do evento */
export const TituloEvento = styled.h2`
  font-size: clamp(0.9rem, 1.9vw, 1.05rem);
  font-weight: 300;
  line-height: 1.25;
  margin: 0;
  color: inherit;
  word-break: break-word;
  overflow-wrap: anywhere;
  hyphens: auto; /* ajuda a quebrar palavras longas em alguns browsers */

  /* reduz ainda mais em telas muito pequenas */
  @media (max-width: 420px) {
    font-size: clamp(0.78rem, 2.4vw, 0.95rem);
    line-height: 1.22;
  }
`;

//cfunção que renderixa tudo
export function InformacoesEvento() {
  return (
    <InformacoesEventoComponent>
      <div className="divEncapsuladora">
        <TituloEvento>
          Tente deixar seu perfil confiável e estiloso para galera poder criar
          conexão e credibilidade com sua pessoa
        </TituloEvento>
      </div>
    </InformacoesEventoComponent>
  );
}
