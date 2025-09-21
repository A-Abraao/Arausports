import styled from "styled-components";
import { ButtonDeAcao } from "../EventoMarcado/MaisDetalhesButton";
import Textos from "./Textos";

const CriarEventoComponent = styled.div`
    background: springgreen;
    border-radius: 0.5em;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1em;
    padding: 2.25em;
    width: 100%;
`

export function CriarEvento() {
    return (
        <CriarEventoComponent>
            <Textos/>
            <ButtonDeAcao children={"Criar evento"}/>
        </CriarEventoComponent>
    )
}