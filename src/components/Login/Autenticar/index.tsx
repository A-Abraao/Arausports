import styled from "styled-components";
import GoogleLogoSRC from "../../../assets/img/google-logo.png";
import { loginWithGoogle } from "./googleAuth";
import FcebookLogoSRC from "../../../assets/img/facebook-logo.png";
import { IconButton } from "@mui/material";

//criaremos o componente de autenticação
const AutenticarComponent = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;

  h2 {
    font-weight: 500;
    font-size: 1em;
  }

  img {
    height: 1.3em;
    width: 1.3em;
  }
`;

//div que serve apenas para segurar os logos do facebook e do google
const DivEncapsuladora = styled.div`
  display: flex;
  width: 100%;
  gap: 0.65em;
  justify-content: center;
`;

//função que renderiza a parada lá no site
function Autenticar() {
 
  return (
    <AutenticarComponent>
      <h2>entre também com:</h2>
      <DivEncapsuladora>
        <IconButton size="small" onClick={() => loginWithGoogle()}>
          <img src={GoogleLogoSRC} alt="logo do google" />
        </IconButton>

        <IconButton size="small">
          <img src={FcebookLogoSRC} alt="logo do facebook" />
        </IconButton>
      </DivEncapsuladora>
    </AutenticarComponent>
  );
}

export default Autenticar;
