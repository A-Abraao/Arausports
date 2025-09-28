import styled from "styled-components";
import { useState } from "react";
import EmailInput from "./EmailInput";
import InputSenha from "./InputSenha";
import { Button } from "@mui/material";
import { verificaEmail } from "../Autenticar/emailLoginController";
import { verificaSenha } from "../Autenticar/senhaLoginController";
import Autenticar from "../Autenticar";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Alerta/AlertProvider";
import { useAuth } from "../../../contexts/AuthContext";

// componente do formulario
const FormularioComponent = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1.1em;
  padding: 1em 1em 0.25em 1em;

  .botoes {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap:0.75em;
  }
`;

function Formulario() {
  const [valorEmail, setValorEmail] = useState("");
  const [valorSenha, setValorSenha] = useState("");
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailTrim = valorEmail.trim();
    const senhaVal = valorSenha; // mantenha a senha como está para checar comprimento (não trim por padrão)

    // DEBUG: mostra o que está sendo enviado (remova em produção)
    console.log("DEBUG login ->", {
      email: emailTrim,
      emailLength: String(emailTrim).length,
      passwordType: typeof senhaVal,
      passwordLength: String(senhaVal).length,
    });

    const emailOk = verificaEmail(emailTrim);
    const senhaOk = verificaSenha(senhaVal);

    if (!emailOk) {
      showAlert("email não me parece válido", {
        severity: "error",
        duration: 4500,
        variant: "standard",
        sx: {
          backgroundColor: "#DC143C",
          color: "#ffffff",
          fontWeight: 500,
          "& .MuiAlert-message": { fontWeight: 500 },
          "& .MuiAlert-icon": { color: "#ffffff" },
        },
      });
      return;
    }

    if (!senhaOk) {
      showAlert("ops, ta sem senha aí", {
        severity: "error",
        duration: 4500,
        variant: "standard",
        sx: {
          backgroundColor: "#DC143C",
          color: "#ffffff",
          fontWeight: 500,
          "& .MuiAlert-message": { fontWeight: 500 },
          "& .MuiAlert-icon": { color: "#ffffff" },
        },
      });
      return;
    }

    setLoading(true);
    try {
      // use emailTrim e senhaVal (se quiser trim na senha, troque senhaVal por senhaVal.trim())
      await signIn(emailTrim, senhaVal);

      showAlert("Login realizado com sucesso!", {
        severity: "success",
        duration: 2500,
        variant: "standard",
        sx: {
          backgroundColor: "#006400",
          color: "#ffffff",
          fontWeight: 500,
        },
      });

      navigate("/homepage");
    } catch (err: any) {
      console.error("Erro ao logar (front):", err);
      const message = err?.message ?? "Erro ao autenticar";
      showAlert(message, {
        severity: "error",
        duration: 4500,
        variant: "standard",
        sx: {
          backgroundColor: "#DC143C",
          color: "#ffffff",
          fontWeight: 500,
          "& .MuiAlert-message": { fontWeight: 500 },
          "& .MuiAlert-icon": { color: "#ffffff" },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioComponent onSubmit={handleSubmit}>
      <EmailInput value={valorEmail} onChange={setValorEmail} />
      <InputSenha value={valorSenha} onChange={setValorSenha} />

      <div className="botoes">
        <Button
          type="submit"
          disabled={loading}
          sx={{
            background: "dodgerblue",
            color: "white",
            height: "2.15em",
            width: "100%",
            textTransform: "none",
          }}
        >
        {loading ? "Entrando..." : "Login"}
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
      </div>
    
      <Autenticar />
    </FormularioComponent>
  );
}

export default Formulario;
