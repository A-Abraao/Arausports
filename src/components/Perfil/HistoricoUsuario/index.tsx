import styled from "styled-components";
import { FiltroHistorico } from "./FiltroHistorico";
import { CardEvento } from "./CardEvento";


const HistoricoUsuarioComponent = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.9em;
    margin-top: 2em;
`

export function HistoricoUsuario() {
    return (
        <HistoricoUsuarioComponent>
            <FiltroHistorico/>
            <CardEvento/>
        </HistoricoUsuarioComponent>
    )
}