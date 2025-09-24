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

interface UsuarioProps {
    name: string;
}

export function Usuario({name}: UsuarioProps) {
    return (
        <UsarioComponent>
            <Titulo>{name}</Titulo>
            <TextoDescricaoUsuario>mano só criei a conta aqui e é isso..</TextoDescricaoUsuario>
            <Estastisticas/>
            <ButtonContainer/>
        </UsarioComponent>
    )
}