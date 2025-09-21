import styled from "styled-components";
import { EditarPerfilButton } from "./editarPerfil";
import { AdicionarAmigo } from "./adicionarAmigo";

const ButtonContainerComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75em;
`

export function ButtonContainer() {
    return (
        <ButtonContainerComponent>
            <EditarPerfilButton/>
            <AdicionarAmigo/>
        </ButtonContainerComponent>
    )
}