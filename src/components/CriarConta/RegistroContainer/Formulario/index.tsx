import React, { useRef, useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { signUpWithEmail } from "../../../../firebase";
import {
  EmailAuthProvider,
  linkWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../../../firebase";
import { useNavigate } from "react-router-dom";

export const FormContainer = styled.div`
  width: 50%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
`;

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Formulario() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showGoogleLinkPrompt, setShowGoogleLinkPrompt] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError(null);
    setSuccess(null);
    setShowGoogleLinkPrompt(false);
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

  const handleSignInWithGoogleAndLink = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const current = result.user; 

      if (!current || !current.email) {
        throw new Error("Não foi possível identificar usuário Google.");
      }

      if (current.email.toLowerCase() !== form.email.trim().toLowerCase()) {
        throw new Error(
          "O e-mail do Google não corresponde ao e-mail informado no formulário. Confirme estar usando o mesmo e-mail."
        );
      }

      const credential = EmailAuthProvider.credential(form.email.trim(), form.password);

      await linkWithCredential(current, credential);

      setSuccess("Senha vinculada à conta Google com sucesso — agora você pode logar também por e-mail/senha.");
      setShowGoogleLinkPrompt(false);
    } catch (err: any) {

      const code = err?.code ?? "";
      if (code === "auth/credential-already-in-use") {
        setError("Essa senha/credencial já está ligada a outra conta.");
      } else if (code === "auth/provider-already-linked") {
        setError("Esse provedor já está vinculado a essa conta.");
      } else if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setError("Popup do Google foi fechado. Tente novamente.");
      } else {
        setError(err?.message ?? String(err));
      }
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);
  setShowGoogleLinkPrompt(false);

  const validationError = validate();
  if (validationError) return setError(validationError);

  setLoading(true);

  try {
    const emailTrim = form.email.trim();

    await signUpWithEmail(
      form.username.trim(),
      emailTrim,
      form.password
    );

    setSuccess("Vamo verifica esse email aí");
    setForm((s) => ({ ...s, password: "", confirmPassword: "" }));
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  } catch (err: any) {
    const code = err?.code ?? "";
    if (code === "auth/email-already-in-use") {
      setError("Já temos esse email aqui na firma");
    } else {
      setError(err?.message ?? String(err));
    }
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
          placeholder="voce será chamado assim"
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
          label="E-mail"
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
          placeholder="Crie uma senha cara"
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
          label="confirma a senha"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          placeholder="Repita a senha zé"
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

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, alignItems: "center" }}>
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

          {showGoogleLinkPrompt && (
            <Button
              type="button"
              variant="outlined"
              onClick={handleSignInWithGoogleAndLink}
              disabled={loading}
              sx={{ textTransform: "none", height: 36 }}
            >
              Entrar com Google e vincular senha
            </Button>
          )}
        </Box>
      </Box>
    </FormContainer>
  );
}
