import React, { useRef, useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSignUpWithEmail } from "../../../../firebase";
import { useAlert } from "../../../Alerta/AlertProvider";
import {
  EmailAuthProvider,
  linkWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../../../firebase/config";
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
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Formulario() {
  const navigate = useNavigate();
  const { showAlert } = useAlert()

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showGoogleLinkPrompt, setShowGoogleLinkPrompt] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const { signUp, loading } = useSignUpWithEmail();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setShowGoogleLinkPrompt(false);
  };

  const emailLooksValid = (email: string): boolean => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  };

  const validate = (): string | null => {
    if (!form.email.trim()) {
      showAlert("acho que tem alguma coisa faltando no email", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      })
      return ""
    }

    if (!form.email.trim() || !emailLooksValid(form.email)) {
      showAlert("esse email aí não da", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      })

      return ""
    }
      
    if (form.password.length < 8){
      showAlert("a senha tem que ter uns 8 caracteres", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      })
      return ""
    };
    if (form.password !== form.confirmPassword) {
      showAlert("as senhas não coincidem cara!", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      })
      return ""
    }
    return null;
  };

  const handleSignInWithGoogleAndLink = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const current = result.user;

      if (!current || !current.email) {
        showAlert("usuário google não identificado", {
          severity: "error",
          duration: 3800,
          variant: "standard"
        })
        throw new Error("Não foi possível identificar usuário Google.");
      }

      if (current.email.toLowerCase() !== form.email.trim().toLowerCase()) {
        showAlert("esse email aí ta estranho...", {
          severity: "error",
          duration: 3800,
          variant: "standard"
        })
      }

      const credential = EmailAuthProvider.credential(
        form.email.trim(),
        form.password
      );

      await linkWithCredential(current, credential);

      showAlert("agora é logar com email e senha e vê se não esquece a senha zezão", {
        severity: "warning",
        duration: 3800,
        variant: "standard"
      })

      setShowGoogleLinkPrompt(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowGoogleLinkPrompt(false);

    const validationError = validate();
    if (validationError) return alert(validationError);

    try {
      await signUp(form.email.trim(), form.password);
      showAlert("Só verificar o email agora..", {
        severity: "success",
        duration: 3800,
        variant: "standard"
      })

      setForm((s) => ({ ...s, password: "", confirmPassword: "" }));
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      showAlert("deu erro no console..", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      })
      console.error(err);
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
        noValidate
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            alignItems: "center",
          }}
        >
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
