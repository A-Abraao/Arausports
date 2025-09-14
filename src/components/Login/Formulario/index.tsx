import styled from "styled-components";
import EmailInput from "./EmailInput";
import InputSenha from "./InputSenha";
import { Button } from "@mui/material";
import Autenticar from "../Autenticar";

//criamos o componente formulario..
const FormularioComponent = styled.form`
    background: purple;
    display: flex;
    flex-direction: column;
    gap: 1.05em;
    padding: 1em 1em 0.25em 1em;
`


//e usamos a função formulario para renderizar esse componente
function Formulario() {

    return(
        <FormularioComponent>
            <EmailInput/>
            <InputSenha/>
            <Button className="botao-login" sx={{
                background: "dodgerblue",
                color: "white",
                height: "2.15em",
                textTransform: "none",
            }}>prosseguir</Button>
            <Autenticar/>
        </FormularioComponent>
    )
}

export default Formulario
