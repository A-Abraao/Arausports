import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "./GoogleAuth";
import GoogleLogoSRC from "../../../assets/img/google-logo.png";
import FcebookLogoSRC from "../../../assets/img/facebook-logo.png";
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useAlert } from "../Alerta/AlertProvider";

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

function Autenticar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      // navega pra homepage e passa flag para mostrar o alerta apenas lá
      navigate("/homepage", { state: { fromLogin: true } });
    } catch (err) {
      console.error(err);
      showAlert("Erro ao autenticar com o Google.", { severity: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AutenticarComponent>
      <h2>entre também com:</h2>
      <div style={{ display: "flex", gap: ".65em", justifyContent: "center" }}>
        <IconButton size="small" onClick={handleGoogle} disabled={loading}>
          <img src={GoogleLogoSRC} alt="logo do google" />
        </IconButton>

        <IconButton size="small">
          <img src={FcebookLogoSRC} alt="logo do facebook" />
        </IconButton>
      </div>
    </AutenticarComponent>
  );
}

export default Autenticar;
