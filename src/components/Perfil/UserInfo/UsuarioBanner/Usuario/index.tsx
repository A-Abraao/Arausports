import styled from "styled-components";
import { Estastisticas } from "./Estatisticas";
import { ButtonContainer } from "./Botoes";

const UsarioComponent = styled.div`
    display: flex;
    flex-direction: column;
    width: 55%;
    gap: 1.35em;
    flex-wrap: wrap;
`

const Titulo = styled.h1`
    font-size: 2.25em;
    font-weight: 500;
    `
    
const TextoDescricaoUsuario = styled.p`

    font-size: 0.9em;
    
`

export function Usuario() {
    return (
        <UsarioComponent>
            <Titulo>New user</Titulo>
            <TextoDescricaoUsuario>mano só criei a conta aqui carai..</TextoDescricaoUsuario>
            <Estastisticas/>
            <ButtonContainer/>
        </UsarioComponent>
    )
}