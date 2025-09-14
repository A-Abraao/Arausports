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
    color: white;
    display: flex;
    justify-content: center;
    height: 100vh;
    width: 100vw;
`

//A div 'Principal' tem a unica função de segurar os outros componentes da pagina e impedir que alguma coisa saiu do controle
const Principal = styled.div`
    align-items: center;
    background: black;
    display: flex;
    flex-direction: column;
    height: 50%;
    justify-content: center;
    width: 50%;
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