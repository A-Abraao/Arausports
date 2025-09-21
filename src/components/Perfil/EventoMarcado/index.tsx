import styled from "styled-components";
import { Titulo } from "./Titulo";
import { InformacoesEvento } from "./InformacoesEvento";

export const EventoMarcadoComponent = styled.section`
    background: var(--gradient-secondary);
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 1em;
    padding: 2.25em;
    overflow-wrap: break-word;
    width: 100%;
`

export function EventoMarcado() {
    return (
        <EventoMarcadoComponent>
            <Titulo/>
            <InformacoesEvento/>
        </EventoMarcadoComponent>
    )
}