import styled from "styled-components";
import { Banner } from "./Banner";
import FormularioCriarConta from "./Formulario";
import LeftArrow from '../../../assets/img/retornar-setinha.svg?react'
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegistroContainerComponent = styled.div`
  border-radius: 1em;
  background: white;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 88vh;
  border: 1px solid #ddd;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  padding: 0.8em;
  box-sizing: border-box;

  & > * {
    border-radius: 0.7em;
  }
`;



const BackButtonWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;

  svg {
    width: 1.5em;
    height: 1.5em;
  }
`;

export function RegistroContainer() {
  const navigate = useNavigate();

  return (
    <RegistroContainerComponent>
      <BackButtonWrapper>
        <IconButton onClick={() => navigate("/")}>
          <LeftArrow />
        </IconButton>
      </BackButtonWrapper>

      <Banner />
      <FormularioCriarConta />
    </RegistroContainerComponent>
  );
}
