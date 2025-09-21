import styled from "styled-components";
import { UsuarioBanner } from "./UsuarioBanner";
import { EventoMarcado } from "../EventoMarcado";

const UserInfoComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 1.25em;
    padding: 2.5em 11em 0em 11em;
    overflow-wrap: break-word;
    width: 100%;
`

export function UserInfo() {
    return (
        <UserInfoComponent>
            <UsuarioBanner/>
            <EventoMarcado/>
        </UserInfoComponent>
    )
}