import styled from "styled-components";
import { TituloEvento } from "../../EventoMarcado/InformacoesEvento";

const TextosComponent = styled.div`
  display: flex;
  width: 100%;

  .textos-div {
    display: flex;
    flex-direction: column;
    gap: clamp(0.45rem, 1.0vw, 0.65rem);
    min-width: 0;
    /* permitir que o bloco de texto quebre com segurança sem forçar largura excessiva */
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  p {
    font-size: clamp(0.85rem, 1.6vw, 1rem);
    margin: 0;
    color: inherit;
  }

  /* em telas pequenas, dar menos margem e permitir o texto reduzir */
  @media (max-width: 720px) {
    margin-bottom: 0.5rem;

    p {
      font-size: clamp(0.78rem, 2.4vw, 0.95rem);
    }
  }
`;

//rendeeriza componente
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
