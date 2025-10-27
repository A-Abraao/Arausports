import { useState } from "react"
import styled from "styled-components"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useAlert } from "../../../Alerta/AlertProvider"
import { useNavigate } from "react-router-dom"
import { useEmailAuth } from "../../../../supabase"

//criar o componente do formulário
export const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;

  /* fazer com que os inputs nunca fiquem com largura máxima em telas de celular */
  form {
    width: 100%;
    max-width: 520px; /* mantém o formulário estreito para telas menores */
    display: flex;
    flex-direction: column;
    align-items: center; /* centraliza os campos quando eles forem menores que 100% */
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    width: 50%; /* no desktop o banner vai aparecer */
    padding: 2rem;

    form {
      max-width: none;
      width: 100%;
    }
  }
`
//textfield customizado, útil quando voce quer reaproveitar a estrutura e mudar alguns aspectos
const StyledTextField = styled(TextField)`
  width: 100%;
  height: 3.3rem;
  max-width: 520px; /* configuração extra para telas pequenas */

  /* faz que cada campo de texto tenha 60% da largura e mantém tudo centralizado lá */
  @media (min-width: 1024px) {
    width: 60%;
    max-width: 720px; /* evita que cresça demais em telas super largas e quebre tudo*/
    min-width: 260px;  /* não deixa ficar pequeninho demais em janelas estreitas demais*/
  }

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

//novamente outro componente customizado
const StyledButton = styled(Button)`
  /* altura e formatação de texto para sempre em minusculo padrão */
  height: 2rem;
  text-transform: none;

  /* evita quebra e overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* padding e largura mínima */
  padding: 0.35rem 0.85rem;
  min-width: 100px;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* fonte menor, mas responsiva (efeito em cascata diminui junto com o componente) */
  font-size: clamp(0.8rem, 1.2vw, 0.95rem);

  /* telas bem pequenas: encolhe mais pro cara que usa uma ripa */
  @media (max-width: 420px) {
    height: 1.6rem;
    padding: 0.28rem 0.6rem;
    font-size: clamp(0.72rem, 2.2vw, 0.82rem);
    min-width: 88px;
  }
`;

//renderizar
export default function FormularioCriarConta() {
  //hooks que o componente vai usar, navigate permite navegar livremente para o site, alert mostra um alert para avisar, sigunp criar conta
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const { signUp, loading: signUpLoading } = useEmailAuth()

  //states que armazenam o valor do email, senha e se o usuário pode confirmar o email
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  //validar a criar da conta
  const validate = () => {
    //verifica email
    if (!email.trim()) {
      showAlert("Insira um e-mail válido ae", { severity: "error", duration: 3500 })
      return false
    }
    //ver senha tamanho
    if (password.length < 6) {
      showAlert("A senha precisa ter ao menos 6 caracteres", { severity: "error", duration: 3500 })
      return false
    }
    // ver se as duas senhas batem
    if (password !== confirmPassword) {
      showAlert("As senhas não coincidem", { severity: "error", duration: 3500 })
      return false
    }
    return true
  }

  //função que faz o submit do formulario ou seja, pega os dados, envia pro suapabase e tenta criar conta, se der certo ele manda para a página de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      //email normalizado para não ter conta duplicada
      const normalized = email.trim().toLowerCase();
      //exectua o hook de signup passando o email normalizado e a senha como parametro
      await signUp(normalized, password);
      //mostra um alert indicando que vai verificar o email
      showAlert("Vamo lá ver esse email aí..", { severity: "success", duration: 4000 })
      //navega para a pagina de verificar email
      navigate("/verificar-email", { state: { email: email.trim() } })
      //pega o erro e mostra ele
    } catch (err: any) {
      showAlert("Erro ao criar conta", { severity: "error", duration: 3500 })
      console.error("signUp error:", err)
    }
  }

  //renderiza os componentes
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
        <Typography variant="h6" align="center"><span>Criar conta</span></Typography>

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
