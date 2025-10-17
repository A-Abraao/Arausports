import React, { useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAlert } from "../../../Alerta/AlertProvider";
import { useNavigate } from "react-router-dom";
import { useEmailAuth, useGoogleAuth } from "../../../../supabase";
import GoogleIcon from "@mui/icons-material/Google";

export const FormContainer = styled.div`
  width: 50%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
`;

export default function FormularioCriarConta() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { signUp, loading: signUpLoading } = useEmailAuth();
  const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validate = () => {
    if (!email.trim()) {
      showAlert("Insira um e-mail válido", { severity: "error", duration: 3500 });
      return false;
    }
    if (password.length < 6) {
      showAlert("A senha precisa ter ao menos 6 caracteres", { severity: "error", duration: 3500 });
      return false;
    }
    if (password !== confirmPassword) {
      showAlert("As senhas não coincidem", { severity: "error", duration: 3500 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signUp(email.trim(), password);
      showAlert("Conta criada! Verifique seu e-mail (se aplicável).", { severity: "success", duration: 4000 });
      navigate("/");
    } catch (err: any) {
      showAlert("Erro ao criar conta", { severity: "error", duration: 3500 });
      console.error("signUp error:", err);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      showAlert("Conta criada com Google!", { severity: "success", duration: 4000 });
      navigate("/homepage");
    } catch (err: any) {
      showAlert("Erro ao criar conta com Google", { severity: "error", duration: 3500 });
      console.error("signInWithGoogle error:", err);
    }
  };

  return (
    <FormContainer>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6" align="center">Criar conta</Typography>

        <TextField label="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth />
        <TextField label="Senha" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required fullWidth />
        <TextField label="Confirmar senha" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required fullWidth />

        <Button type="submit" variant="contained" disabled={signUpLoading} sx={{ width: "100%", height: "2.5em", textTransform: "none" }}>
          {signUpLoading ? "Criando..." : "Criar conta"}
        </Button>

        <Button variant="outlined" disabled={googleLoading} onClick={handleGoogleSignUp} sx={{ width: "100%", height: "2.5em", textTransform: "none" }}>
          <GoogleIcon /> {googleLoading ? "Conectando..." : "Criar conta com Google"}
        </Button>
      </Box>
    </FormContainer>
  );
}
