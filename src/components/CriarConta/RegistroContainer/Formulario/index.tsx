import { useState } from "react"
import styled from "styled-components"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useAlert } from "../../../Alerta/AlertProvider"
import { useNavigate } from "react-router-dom"
import { useEmailAuth } from "../../../../supabase"

export const FormContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
`

const StyledTextField = styled(TextField)`
  width: 70%;
  height: 3.3rem;

  & .MuiOutlinedInput-root {
    border-radius: 0.5em;
    height: 100%;
    font-size: 0.9rem;

    & input {
      padding: 0.53em 0.9em;
      font-size: 0.9rem;
      line-height: 1.2;
    }
  }

  & .MuiInputLabel-root {
    font-size: 0.9rem;
    top: -0.2em;
  }

  & .MuiOutlinedInput-notchedOutline {
    top: 0;
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: var(--ring) !important;
  }
`

const StyledButton = styled(Button)`
  height: 2.25em;
  text-transform: none;
`

export default function FormularioCriarConta() {
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const { signUp, loading: signUpLoading } = useEmailAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validate = () => {
    if (!email.trim()) {
      showAlert("Insira um e-mail válido", { severity: "error", duration: 3500 })
      return false
    }
    if (password.length < 6) {
      showAlert("A senha precisa ter ao menos 6 caracteres", { severity: "error", duration: 3500 })
      return false
    }
    if (password !== confirmPassword) {
      showAlert("As senhas não coincidem", { severity: "error", duration: 3500 })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await signUp(email.trim(), password)
      showAlert("Conta criada! Verifique seu e-mail para o código de verificação.", { severity: "success", duration: 4000 })
      navigate("/verificar-email", { state: { email: email.trim() } })
    } catch (err: any) {
      showAlert("Erro ao criar conta", { severity: "error", duration: 3500 })
      console.error("signUp error:", err)
    }
  }

  return (
    <FormContainer>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" align="center">Criar conta</Typography>

        <StyledTextField
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
        />

        <StyledTextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
        />

        <StyledTextField
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          variant="outlined"
        />

        <StyledButton
          type="submit"
          variant="contained"
          disabled={signUpLoading}
          sx={{
            background: "var(--gradient-hero)",
            "&:hover": { filter: "brightness(0.95)" },
            width: "35%",
            textTransform: "none"
          }}
        >
          {signUpLoading ? "Criando..." : "Criar conta"}
        </StyledButton>
      </Box>
    </FormContainer>
  )
}


