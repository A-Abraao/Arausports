import styled from "styled-components";
import bannerSRC from '../../assets/img/login-banner.jpg'
import Formulario from "./Formulario";

//estilização da pagina de login
const LoginPage = styled.div`
    align-items: center;
    background-image: 
        linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%),
        url(${bannerSRC});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
`
//a div princiapal serve apenas para segurar os componentes dentro e definir o típico fundo branco do formulario
const Principal = styled.div`
  align-items: center;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 62dvh;
  min-height: calc(var(--vh, 1vh) * 62);
  min-height: 62vh;
  max-height: 90vh;
  width: clamp(280px, 25vw, 420px);

  h1 {
    font-size: 1.35em;
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
