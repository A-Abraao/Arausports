import styled from "styled-components";
import { ImagemDePerfil } from "../../../../UsuarioBanner";
import StarSvg from '../../../../../../../assets/img/trofeu.svg?react'

const UsuarioComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
`

const DivImagem = styled(ImagemDePerfil)`
    height: 3em;
    width: 3em;
`

const EventoEData = styled.div`
    display: flex;
    flex-direction: column;
    word-break: break-all;

    span {
        color: var(--muted-foreground);
        display: flex;
        align-items: center;
        gap: 0.4em;
        font-weight: 400;
    }

    .data {
        font-size: 0.85em;
    }
`

export function Usuario() {
    return (
        <UsuarioComponent>
            <DivImagem/>
            <EventoEData>
                <span><StarSvg height="0.9em" width="0.9em"/>Evento criado</span>
                <span className="data">24-01-2025</span>
            </EventoEData>
        </UsuarioComponent>
    )
}