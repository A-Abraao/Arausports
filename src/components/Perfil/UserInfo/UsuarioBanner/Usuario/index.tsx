import styled from "styled-components";
import { Estastisticas } from "./Estatisticas";
import { ButtonContainer } from "./Botoes";

const UsarioComponent = styled.div`
    display: flex;
    flex-direction: column;
    width: min(55%, 100%);
    gap: clamp(0.6rem, 1.4vw, 1.35rem);
    flex-wrap: wrap;
`

const Titulo = styled.h1`
    font-size: clamp(1.125rem, 3.2vw, 2.25rem);
    font-weight: 500;
`
    
const TextoDescricaoUsuario = styled.p`
    font-size: clamp(0.8rem, 1.4vw, 0.9rem);
    margin: 0;
`

interface UsuarioProps {
    name: string;
    usuarioBio: string;
    eventosCriados: string;
    participacoes: string;
    conexoes: string
}

export function Usuario({ name, usuarioBio, eventosCriados, participacoes, conexoes }: UsuarioProps) {
    return (
        <UsarioComponent>
            <Titulo>{name}</Titulo>
            <TextoDescricaoUsuario>{usuarioBio}</TextoDescricaoUsuario>
            <Estastisticas eventosCriados={eventosCriados} participacoes={participacoes} conexoes={conexoes}/>
            <ButtonContainer/>
        </UsarioComponent>
    )
}
