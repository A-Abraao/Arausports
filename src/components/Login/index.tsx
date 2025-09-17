import styled from "styled-components";
import bannerSRC from '../../assets/img/login-banner.jpg'
import Formulario from "./Formulario";

//Componente da pagina de login sendo criado aqui véi..
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
    height: 100vh;
    width: 100vw;
`

//A div 'Principal' tem a unica função de segurar os outros componentes da pagina e impedir que alguma coisa saiu do controle
const Principal = styled.div`
    align-items: center;
    background: white;
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
    height: 62%;
    justify-content: center;
    width: 25%;
`

//Página de login é renderizada pela função que tem o mesmo nome da pagina
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

export default Login