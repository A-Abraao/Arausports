import styled from "styled-components";
import { TituloEvento } from "../../EventoMarcado/InformacoesEvento";

const TextosComponent = styled.div`
  display: flex;
  width: 100%;

  .textos-div {
    display: flex;
    flex-direction: column;
    gap: clamp(0.45rem, 1.0vw, 0.65rem);
  }

  p {
    font-size: clamp(0.85rem, 1.6vw, 1rem);
    margin: 0;
    color: inherit;
  }

  @media (max-width: 720px) {
    margin-bottom: 0.5rem;
  }
`;

export default function Textos() {
  return (
    <TextosComponent>
      <div className="textos-div">
        <TituloEvento>Pronto para seu próximo role?</TituloEvento>
        <p>Crie e compartilhe seu próximo evento para a rapaziada</p>
      </div>
    </TextosComponent>
  );
}
