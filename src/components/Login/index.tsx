import styled from "styled-components";
import bannerSRC from '../../assets/img/login-banner.jpg'
import Formulario from "./Formulario";

//criar pagina de login
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

  ${({ theme }) => theme.breakpoints.down("sm")} {
    background-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%);
    background-color: var(--background);
    padding: 1rem;
  }
`;

//div principal engloba todos os componentes do formulario e serve para dar fundo branco
const Principal = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    align-self: center;

    min-width: min(360px, 94%);
    max-width: 360px;
    padding: 1rem;
    margin: 0 auto;
    box-sizing: border-box;

    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 8px 22px rgba(16, 24, 40, 0.06);

    min-height: calc(var(--vh, 1vh) * 56);
    max-height: 90vh;
    overflow-y: auto;

    h1 {
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
      text-align: center;
      width: 100%;
    }

    ${({ theme }) => theme.breakpoints.up("lg")} {
      width: 360px;
    }

    ${({ theme }) => theme.breakpoints.down("sm")} {
      padding: 0.9rem;
      width: 100%;
      max-width: 360px;
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
