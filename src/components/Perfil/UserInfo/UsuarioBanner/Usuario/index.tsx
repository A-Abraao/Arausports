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
    usuarioBio: string
}

export function Usuario({name, usuarioBio}: UsuarioProps) {
    return (
        <UsarioComponent>
            <Titulo>{name}</Titulo>
            <TextoDescricaoUsuario>{usuarioBio}</TextoDescricaoUsuario>
            <Estastisticas/>
            <ButtonContainer/>
        </UsarioComponent>
    )
}