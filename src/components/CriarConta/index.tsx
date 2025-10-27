import styled from "styled-components";
import { RegistroContainer } from "./RegistroContainer";

//componente que estiliza e cria a pagina de criar conta
const CriarContaComponent = styled.div`
  background: var(--cinza);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 1.25rem; /* mobile padding */

  /* desktop padding */
  @media (min-width: 1024px) {
    padding: 2em 5.5em;
  }
`;

export function CriarConta() {
    return (
        <CriarContaComponent>
            <RegistroContainer/>
        </CriarContaComponent>
    )
}