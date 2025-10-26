import styled from "styled-components";
import bannerSRC from '../../assets/img/login-banner.jpg'
import Formulario from "./Formulario";

const LoginPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image:
    linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%),
    url(${bannerSRC});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  padding: 2rem 1rem;
  box-sizing: border-box;

  /* Em telas pequenas melhorar legibilidade/remover imagem */
  ${({ theme }) => theme.breakpoints.down("sm")} {
    background-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%);
    background-color: var(--background);
    padding: 1rem;
  }
`;

// a div princiapal serve apenas para segurar os componentes dentro e definir o típico fundo branco do formulario
const Principal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* impedir estiramento pelo parent flex */
  flex: 0 0 auto;
  align-self: center;

  /* largura controlada — nunca maior que 420px, mas responsiva */
  width: min(420px, 96%);
  max-width: 420px;
  padding: 1.25rem;
  margin: 0 auto;
  box-sizing: border-box;

  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);

  /* altura com sua var --vh */
  min-height: calc(var(--vh, 1vh) * 62);
  max-height: 90vh;
  overflow-y: auto;

  h1 {
    font-size: 1.35em;
    margin-bottom: 0.6rem;
    text-align: center;
    width: 100%;
  }

  /* em telas maiores mantemos a mesma largura fixa visual (não estica) */
  ${({ theme }) => theme.breakpoints.up("lg")} {
    width: 420px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 1rem;
    width: 100%;
    max-width: 420px;
  }
`;

//componente da pagina de login
function Login() {
    return (
        <LoginPage>
            <Principal>
                <h1>Bem - vindo!</h1>
                <Formulario/>
            </Principal>

        </LoginPage>
    )
}

export default Login;
