import styled from "styled-components";
import { useState } from "react";
import EmailInput from "./EmailInput";
import InputSenha from "./InputSenha";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../Alerta/AlertProvider";
import { useEmailAuth, useGoogleAuth } from "../../../supabase/auth/useSupabaseAuth";
import GoogleIcon from "@mui/icons-material/Google";

const FormularioComponent = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1em;
  padding: 0.75em 1.75em 0.75em 1.75em;

  .botoes {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.75em;
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    width: 100%;
  }
`;

function Formulario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const { signIn, loading: emailLoading, error: emailError } = useEmailAuth();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();

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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      showAlert("Login com Google realizado!", { severity: "success", duration: 2500 });
      navigate("/homepage");
    } catch (err: any) {
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
            height: "2.15em",
            width: "100%",
            textTransform: "none",
          }}
        >
          {emailLoading ? "Entrando..." : "Login"}
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/criar-conta")}
          sx={{
            width: "100%",
            height: "2.15em",
            textTransform: "none",
            borderColor: "var(--secondary)",
          }}
        >
          Criar Conta
        </Button>

        <Button
          variant="outlined"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="google-btn"
          sx={{
            height: "2.15em",
            borderColor: "#4285F4",
            color: "#4285F4",
            textTransform: "none",
          }}
        >
          <GoogleIcon /> {googleLoading ? "Entrando..." : "Entrar com Google"}
        </Button>
      </div>
    </FormularioComponent>
  );
}

export default Formulario;
