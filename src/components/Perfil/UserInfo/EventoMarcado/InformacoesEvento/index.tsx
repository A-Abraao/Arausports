import styled from "styled-components";

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

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TituloEvento = styled.h2`
  font-size: clamp(0.95rem, 1.8vw, 1.05rem);
  font-weight: 300;
  line-height: 1.3;
  margin: 0;
`;

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
