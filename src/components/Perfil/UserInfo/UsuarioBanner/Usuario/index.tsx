import styled from "styled-components";
import { Estastisticas } from "./Estatisticas";
import { ButtonContainer } from "./Botoes";

export const UsarioComponent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: clamp(0.6rem, 1.4vw, 1.35rem);
    flex-wrap: wrap;

    /* Em telas maiores limitamos a largura para algo parecido com 55% visual */
    ${({ theme }) => theme.breakpoints.up("md")} {
        width: min(55%, 100%);
        max-width: 55%;
    }
`;

export const Titulo = styled.h1`
    font-size: clamp(1.125rem, 3.2vw, 2.25rem);
    font-weight: 500;

    /* em telas pequenas reduzimos levemente para não quebrar linha */
    ${({ theme }) => theme.breakpoints.down("sm")} {
        font-size: clamp(1rem, 4.2vw, 1.45rem);
    }
`;

export const TextoDescricaoUsuario = styled.p`
    font-size: clamp(0.8rem, 1.4vw, 0.9rem);
    margin: 0;
    word-break: break-all;
    margin-bottom: clamp(0.42rem, 1.9vw, 0.58rem);
    
    ${({ theme }) => theme.breakpoints.down("sm")} {
        font-size: clamp(0.72rem, 2.2vw, 0.78rem);
    }
`;

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
