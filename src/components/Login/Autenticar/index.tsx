import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../../firebase";
import GoogleLogoSRC from "../../../assets/img/google-logo.png";
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useAlert } from "../../Alerta/AlertProvider";

const AutenticarComponent = styled.div`
  display: flex;
  flex-direction: column; /* empilha */
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  h2 {
    font-weight: 500;
    font-size: 1em;
    margin: 0;
    text-align: center;
  }

  /* o componente tem um div inline logo depois do h2.
     Forçamos esse filho a ficar em coluna (sobrescreve inline) */
  & > div {
    display: flex !important;
    flex-direction: column !important; /* força empilhar mesmo com inline styles */
    gap: 0.65em !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100%;
  }

  img {
    height: 1.3em;
    width: 1.3em;
    display: block;
    margin: 0; /* sem deslocamento lateral */
  }

  /* ajustes em telas maiores (apenas tamanho do ícone/texto) */
  ${({ theme }) => theme.breakpoints.up("md")} {
    img {
      height: 1.6em;
      width: 1.6em;
    }
    h2 {
      font-size: 1.03rem;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    h2 {
      font-size: 0.95rem;
    }
  }
`;


function Autenticar() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { loading, login } = useGoogleAuth()

  const handleGoogle = async () => {
    try {
      await login();
    } catch (err) {
      console.error(err);
      showAlert("Erro ao autenticar com o Google.", { severity: "error", duration: 4000 });
    } finally {
      navigate("/homepage", { state: { fromLogin: true } });
    }
    
  };

  return (
    <AutenticarComponent>
      <h2>entre também com:</h2>
      <div style={{ display: "flex", gap: ".65em", justifyContent: "center" }}>
        <IconButton size="small" onClick={handleGoogle} disabled={loading} sx={{ 
          display: "flex",
          alignItems: "center",
          gap: "0.5em"
         }}>
          <img src={GoogleLogoSRC} alt="logo do google" />
        </IconButton>
      </div>
    </AutenticarComponent>
  );
}

export default Autenticar;
