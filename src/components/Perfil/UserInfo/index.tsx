import styled from "styled-components";
import { UsuarioBanner } from "./UsuarioBanner";
import { EventoMarcado } from "./EventoMarcado";
import { CriarEvento } from "./CriarEvento";
import { HistoricoUsuario } from "./HistoricoUsuario";

const UserInfoComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: clamp(0.75rem, 1.4vw, 1.25rem);
    padding: clamp(0.75rem, 1.8vh, 2.5rem) clamp(1rem, 6vw, 13rem) 0 clamp(1rem, 6vw, 13rem);
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
