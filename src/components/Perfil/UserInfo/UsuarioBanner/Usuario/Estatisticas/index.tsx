import styled from "styled-components";

export const EstastisticasComponent = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.2vw, 1.4rem);
  flex-wrap: nowrap; /* força permanência em linha */
  width: 100%;
  overflow: visible;

  /* se for absolutamente necessário, permitir rolagem horizontal discreta
     sem quebrar a hierarquia visual (mantém tudo em linha em telas estreitas) */
  ${({ theme }) => theme.breakpoints.down("xs")} {
    gap: clamp(0.5rem, 3vw, 0.8rem);
    overflow-x: auto;
  }
`;

export const Estastistica = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  box-sizing: border-box;

  .numero {
    /* reduzimos a escala dos números para evitar que "empurrem" o layout */
    font-size: clamp(0.85rem, 2.4vw, 1.15rem);
    font-weight: 550;
    line-height: 1;
    white-space: nowrap; /* evita quebra do número em 2 linhas */
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 6.5rem;
  }

  .acao {
    font-size: clamp(0.65rem, 1.6vw, 0.85rem);
    font-weight: 300;
    color: var(--cinza);
    text-align: center;
    white-space: nowrap;
  }

  /* em telas maiores podemos dar um pouco mais de destaque */
  ${({ theme }) => theme.breakpoints.up("md")} {
    .numero {
      font-size: clamp(1rem, 1.6vw, 1.5rem);
      max-width: none;
      overflow: visible;
    }
    .acao {
      font-size: clamp(0.75rem, 1.4vw, 0.9rem);
    }
  }
`;

type EstastisticaProps = {
  eventosCriados: string;
  participacoes: string
  conexoes: string
}

export function Estastisticas({eventosCriados = "0", participacoes = "0"}: EstastisticaProps) {

  const userEstastics = [
    { quantidade: eventosCriados, acao: "Eventos criados" },
    { quantidade: participacoes, acao: "Participações" },
  ];

  return (
    <EstastisticasComponent>
      {
        userEstastics.map((item, index) => (
          <Estastistica key={index}>
            <span className="numero">{item.quantidade}</span>
            <span className="acao">{item.acao}</span>
          </Estastistica>
        ))
      }
    </EstastisticasComponent>
  );
}