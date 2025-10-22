import styled from "styled-components";
import { useState } from "react";
import EmailInput from "./EmailInput";
import InputSenha from "./InputSenha";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../Alerta/AlertProvider";
import { useEmailAuth, useGoogleAuth } from "../../../supabase";
import googleLogoPng from '../../../assets/img/google-logo.png';
import Typography from "@mui/material/Typography";

//estilização do formulario
const FormularioComponent = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.75em;
  padding: 0.7em 1.6em;

  .botoes {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.45em;
  }

  .social-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    margin-top: 0.25rem;
  }

  .social-slogan {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 500;
    text-align: center;
  }

  input,
  textarea,
  .MuiInputBase-root,
  .MuiFormControl-root,
  .MuiOutlinedInput-root {
    font-size: 0.92rem;
  }

  .MuiInputBase-root {
    min-height: 1.9rem;
    height: 1.9rem;
  }

  .MuiOutlinedInput-input {
    padding: 6px 10px;
    line-height: 1.2;
  }

  .MuiFormLabel-root {
    font-size: 0.88rem;
  }

  .botoes .MuiButton-root {
    height: 1.8em;
    min-height: unset;
    font-size: 0.94rem;
    padding: 0 10px;
    text-transform: none;
  }
`;

//botao de login com o google
const GoogleIconButton = styled(IconButton)`
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  &:hover {
    background: rgba(0,0,0,0.04);
  }
  &.Mui-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

//imagem da logo do google
const GoogleLogoImg = styled.img`
  width: 1.5em;
  height: 1em;
  object-fit: contain;
  display: block;
`;

//componente formulario
function Formulario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const { signIn, loading: emailLoading } = useEmailAuth();
  const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !senha) {
      showAlert("Preencha todos os campos!", { severity: "error", duration: 3500 });
      return;
    }

    try {
      await signIn(email.trim(), senha);
      showAlert("Bem-vindo!", { severity: "success", duration: 2500 });
      navigate("/homepage");
    } catch (err: any) {
      showAlert("Login falhou. Verifique suas credenciais.", { severity: "error", duration: 4000 });
      console.error("signIn error:", err);
    }
  };

  const handleGoogleLogin = async (e?: React.MouseEvent) => {
  e?.preventDefault();
  try {
    await signInWithGoogle();
    navigate("/homepage");
  } catch (err) {
      showAlert("Erro ao entrar com Google.", { severity: "error", duration: 4000 });
      console.error("signInWithGoogle error:", err);
    }
  };


  return (
    <FormularioComponent onSubmit={handleEmailLogin}>
      <EmailInput value={email} onChange={setEmail} />
      <InputSenha value={senha} onChange={setSenha} />

      <div className="botoes">
        <Button
          type="submit"
          disabled={emailLoading}
          sx={{
            background: "dodgerblue",
            color: "white",
            height: "1.8em",
            width: "100%",
            textTransform: "none",
          }}
        >
          <Typography component="span" sx={{ fontSize: "0.78rem", lineHeight: 1, fontWeight: 550 }}>
            {emailLoading ? "Entrando..." : "Login"}
          </Typography>
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/criar-conta")}
          sx={{
            width: "100%",
            height: "1.8em",
            textTransform: "none",
            borderColor: "var(--secondary)",
          }}
        >
          <Typography component="span" sx={{ fontSize: "0.78rem", lineHeight: 1, fontWeight: 550 }}>
            Criar Conta
          </Typography>
        </Button>

        <div className="social-area" aria-hidden={false}>
          <h3 className="social-slogan">entre também com:</h3>
          
          <GoogleIconButton
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleGoogleLogin();
            }}
            disabled={!!googleLoading}
            aria-label="Entrar com Google"
            size="medium"
          >
            <GoogleLogoImg src={googleLogoPng} alt="Logo do Google" />
          </GoogleIconButton>
        </div>
      </div>
    </FormularioComponent>
  );
}

export default Formulario;
