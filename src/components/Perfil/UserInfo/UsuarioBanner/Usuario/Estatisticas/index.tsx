import styled from "styled-components";

const EstastisticasComponent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5em;
`;

const Estastistica = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;

  .numero {
    font-size: 1.5em;
    font-weight: 550;
  }

  .acao {
    font-size: 0.85em;
    font-weight: extralight;
    color: var(--cinza);
  }
`;

type EstastisticaProps = {
  eventosCriados: string;
  participacoes: string
  conexoes: string
}

export function Estastisticas({eventosCriados = "0", participacoes = "0", conexoes="0"}: EstastisticaProps) {

  const userEstastics = [
    { quantidade: eventosCriados, acao: "Eventos criados" },
    { quantidade: participacoes, acao: "Participações" },
    { quantidade: conexoes, acao: "Conexões" },
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