import styled from "styled-components";
import { Banner } from "./Banner";
import FormularioCriarConta from "./Formulario";
import { useNavigate } from "react-router-dom";


//componente que criar o container que engloba o banner e o formulário
const RegistroContainerComponent = styled.div`
  border-radius: 1em;
  background: white;
  display: flex;
  flex-direction: column; /* ajustar para mobile */
  align-items: stretch;
  width: 100%;
  max-width: 1100px;
  height: auto; /* defirnir altura em bile */
  border: 1px solid #ddd;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  padding: 0.6rem;
  box-sizing: border-box;
  gap: 0.6rem;

  & > * {
    border-radius: 0.7em;
  }

  /* ajustar em desktop tbm */
  @media (min-width: 1024px) {
    flex-direction: row;
    height: 88vh;
    padding: 0.8em;
  }
`;


//renderizar real o componente na tela
export function RegistroContainer() {
  
  return (
    <RegistroContainerComponent>
      <Banner />
      <FormularioCriarConta />
    </RegistroContainerComponent>
  );
}
