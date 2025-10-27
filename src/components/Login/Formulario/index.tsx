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
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0;
  box-sizing: border-box;

  /* garantir que nada interno extrapole a largura do form */
  &,
  .MuiFormControl-root,
  .MuiInputBase-root,
  .MuiOutlinedInput-root {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }

  .MuiFormControl-root,
  .MuiOutlinedInput-root {
    max-width: 320px; 
    margin-left: auto;
    margin-right: auto;
  }

  input,
  textarea,
  .MuiInputBase-root,
  .MuiFormControl-root,
  .MuiOutlinedInput-root {
    font-size: 0.9rem;
  }

  .MuiOutlinedInput-input {
    padding: 6px 10px;
    line-height: 1.15;
  }

  .MuiFormLabel-root {
    font-size: 0.85rem;
  }

  .botoes {
    display: flex !important;
    flex-direction: column !important;
    width: 100%;
    gap: 0.35rem;
  }
  .botoes .MuiButton-root {
    width: 100% !important;
    min-width: 0;
    height: 1.8em; 
    font-size: 0.94rem;
    text-transform: none;
  }

  .social-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    margin-top: 0.2rem;
    width: 100%;
  }

  .social-slogan {
    margin: 0;
    font-size: 0.86rem;
    font-weight: 500;
    text-align: center;
    width: 100%;
  }
`;


//googleIconButton e googleLogoImg reduzidos 
const GoogleIconButton = styled(IconButton)`
  width: 2.1rem !important;
  height: 2.1rem !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 auto !important;
  padding: 0 !important;
`;

//componente para criar a logo do google
const GoogleLogoImg = styled.img`
  width: 1.7rem;
  height: 1.45rem;
  object-fit: contain;
  display: block;
  margin: 0 auto;
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
      //aqui ele faz o signin e normaliza email para não ter usuario duplicado e dar erro ao criar evento
      const normalized = email.trim().toLowerCase();
      await signIn(normalized, senha);
      showAlert("Salve rapax!!", { severity: "success", duration: 2500 });
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
