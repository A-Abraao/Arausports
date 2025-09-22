import styled from "styled-components";
import { Usuario } from "./Usuario";

const DivUsuarioComponent = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const TipoDoEsporte = styled.span`
    color: white;
    background: var(--secondary);
    border-radius: 9999px;
    padding: 0.45em 0.95em;
    font-size: 0.75em;
    font-weight: 450;
`

export function DivUsuario() {
    return (
        <DivUsuarioComponent>
            <Usuario/>
            <TipoDoEsporte>Futebol</TipoDoEsporte>
        </DivUsuarioComponent>
    )
}