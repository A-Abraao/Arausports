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

//criaremos o compoennte formulario cara
const FormularioComponent = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1.1em;
  padding: 1em 1em 0.25em 1em;
`;

function Formulario() {
  const [valorEmail, setValorEmail] = useState("");
  const [valorSenha, setValorSenha] = useState("");
  const { showAlert } = useAlert();
  const navigate = useNavigate()

  const handleSubmit = () => {
    const emailOk = verificaEmail(valorEmail);
    const senhaOk = verificaSenha(valorSenha);

    if (!emailOk) {
      showAlert("email não me parece válido", {
        severity: "error",
        duration: 4500,
        variant: "standard", // preferível para controlar fundo
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

    // sucesso
    showAlert("Sucesso irmão!", {
      severity: "success",
      duration: 3000,
      variant: "standard",
      sx: {
        backgroundColor: "#006400",
        color: "#ffffff",
        fontWeight: 500,
        "& .MuiAlert-message": { fontWeight: 500 },
        "& .MuiAlert-icon": { color: "#ffffff" },
      },
    });

    navigate("/homepage")

  };

  return (
    <FormularioComponent>
      <EmailInput value={valorEmail} onChange={setValorEmail} />
      <InputSenha value={valorSenha} onChange={setValorSenha} />

      <Button
        type="button"
        onClick={handleSubmit}
        sx={{
          background: "dodgerblue",
          color: "white",
          height: "2.15em",
          width: "100%",
          textTransform: "none",
        }}
      >
        Login
      </Button>
      <Autenticar />
    </FormularioComponent>
  );
}

export default Formulario;
