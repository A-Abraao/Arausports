import styled from "styled-components";
import { useState } from "react";
import EmailInput from "./EmailInput";
import InputSenha from "./InputSenha";
import { Button } from "@mui/material";
import { verificaEmail } from "../Autenticar/emailLoginController";
import { verificaSenha } from "../Autenticar/senhaLoginController";
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

    //guardar o valor do email
    const [valorEmail, setValorEmail] = useState("")

    //guardar o valor da senha
    const [valorSenha, setValorSenha] = useState("")

    return(
        <FormularioComponent>
            <EmailInput value={valorEmail} onChange={setValorEmail}/>
            <InputSenha value={valorSenha} onChange={setValorSenha}/>
            <Button
            onClick={() => {
                verificaEmail(valorEmail)
                verificaSenha(valorSenha)
            }}
            sx={{
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
