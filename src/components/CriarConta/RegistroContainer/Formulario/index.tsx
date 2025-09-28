import React, { useRef, useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const FormContainer = styled.div`
  width: 50%;       
  height: auto;     
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  /* sem box-shadow nem borda por padrão */
`;

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Formulario() {
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const emailLooksValid = (email: string): boolean => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  };

  const validate = (): string | null => {
    if (!form.username.trim()) return "Escolhe um nome ae.";
    if (!form.email.trim() || !emailLooksValid(form.email)) return "esse email não da não.";
    if (form.password.length < 8) return "A senha deve ter uns 8 caracteres.";
    if (form.password !== form.confirmPassword) return "As senhas não coincidem cara.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Erro ao criar conta.");
      }

      setSuccess("Criamos sua contaaaa, mas antes bora ver esse email aí");

      try {
        const nav: any = navigator;
        const win: any = window;
        if (nav.credentials && win.PasswordCredential && formRef.current) {
          try {
            const cred = new win.PasswordCredential(formRef.current);
            await nav.credentials.store(cred).catch(() => {});
          } catch (err) {

          }
        }
      } catch (err) {

      }

      setForm((s) => ({ ...s, password: "", confirmPassword: "" }));
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const inputWidth = "65%"; 
  const inputHeight = 36;
  const inputRadius = "8px"; 

  return (
    <FormContainer>
      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit}
        method="post"
        action="/api/register"
        aria-label="Formulário de registro"
        sx={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "none",
          backgroundColor: "transparent",
          p: 0,
        }}
      >
        <Typography variant="h6" component="h2" align="center">
          Criar conta..
        </Typography>

        <TextField
          id="username"
          name="username"
          label="Nome de usuário"
          value={form.username}
          onChange={onChange}
          placeholder="Seu nome público"
          autoComplete="username"
          required
          size="small"
          sx={{
            width: inputWidth,
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              borderRadius: inputRadius,
              "&:hover fieldset": {
                borderColor: "#dcdcdc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--ring)",
                boxShadow: "0 0 0 4px rgba(0,0,0,0.04)",
              },
            },
          }}
          inputProps={{ style: { height: inputHeight } }}
        />

        <TextField
          id="email"
          name="email"
          label="E‑mail"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="seu@exemplo.com"
          autoComplete="email"
          required
          size="small"
          sx={{
            width: inputWidth,
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              borderRadius: inputRadius,
              "&:hover fieldset": {
                borderColor: "#dcdcdc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--ring)",
                boxShadow: "0 0 0 4px rgba(0,0,0,0.04)",
              },
            },
          }}
          inputProps={{ style: { height: inputHeight } }}
        />

        <TextField
          id="password"
          name="password"
          label="Senha"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Crie uma senha forte"
          autoComplete="new-password"
          inputProps={{ minLength: 8, style: { height: inputHeight } }}
          required
          size="small"
          sx={{
            width: inputWidth,
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              borderRadius: inputRadius,
              "&:hover fieldset": {
                borderColor: "#dcdcdc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--ring)",
                boxShadow: "0 0 0 4px rgba(0,0,0,0.04)",
              },
            },
          }}
        />

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar senha"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          placeholder="Repita a senha"
          autoComplete="new-password"
          inputProps={{ minLength: 8, style: { height: inputHeight } }}
          required
          size="small"
          sx={{
            width: inputWidth,
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              borderRadius: inputRadius,
              "&:hover fieldset": {
                borderColor: "#dcdcdc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--ring)",
                boxShadow: "0 0 0 4px rgba(0,0,0,0.04)",
              },
            },
          }}
        />

        {error && (
          <Typography color="error" role="alert" align="center">
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="textSecondary" align="center">
            {success}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading}
            sx={{
              width: 160,
              background: "var(--gradient-hero)",
              textTransform: "none",
              height: 36,
              
            }}
          >
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </Box>
      </Box>
    </FormContainer>
  );
}
