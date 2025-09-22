import styled from "styled-components";
import { UsuarioBanner } from "./UsuarioBanner";
import { EventoMarcado } from "./EventoMarcado";
import { CriarEvento } from "./CriarEvento";
import { HistoricoUsuario } from "./HistoricoUsuario";

const UserInfoComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 1.25em;
    padding: 2.5em 13em 0em 13em;
    overflow-wrap: break-word;
    width: 100%;
`

export function UserInfo() {
    return (
        <UserInfoComponent>
            <UsuarioBanner/>
            <EventoMarcado/>
            <CriarEvento/>
            <HistoricoUsuario/>
        </UserInfoComponent>
    )
}