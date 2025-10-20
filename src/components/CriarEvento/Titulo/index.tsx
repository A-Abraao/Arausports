import styled from "styled-components";

const DivSuperior = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
    padding: 2.2em;

    span{
        color: var(--muted-foreground);
    }
`

const TituloComponent = styled.h1`
    font-size: 1.9em;
    font-weight: 500;
    text-align: center;
`

export function Titulo() {
    return(
        <DivSuperior>
            <TituloComponent>Crie Seu Próprio Evento</TituloComponent>
            <span>Chame os manos pra resenha!</span>
        </DivSuperior>
    )
}