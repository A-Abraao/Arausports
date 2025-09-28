import styled from "styled-components";
import { estatisticasUsuario } from "./estatisticasUsuario";

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

export function Estastisticas() {
  const { created, joined } = estatisticasUsuario();

  const userEstastics = [
    { quantidade: created, acao: "Eventos criados" },
    { quantidade: joined, acao: "Participações" },
    { quantidade: 0, acao: "Conexões" },
  ];

  return (
    <EstastisticasComponent>
      {userEstastics.map((item, index) => (
        <Estastistica key={index}>
          <span className="numero">{item.quantidade}</span>
          <span className="acao">{item.acao}</span>
        </Estastistica>
      ))}
    </EstastisticasComponent>
  );
}