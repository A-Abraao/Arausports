import styled from "styled-components";
import { Header } from "./Header";
import { UserInfo } from "./UserInfo";

const PerfilComponent = styled.div`
    display: flex;
    color: white;
    flex-direction: column;
    width: 100%;
`

export function Perfil() {
    return (
        <PerfilComponent>
            <Header/>
            <UserInfo/>
        </PerfilComponent>
    )
}