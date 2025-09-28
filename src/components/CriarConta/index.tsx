import styled from "styled-components";
import { RegistroContainer } from "./RegistroContainer";

const CriarContaComponent = styled.div`
    background var(--cinza)
    display: flex
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    padding: 2em 5.5em;
`

export function CriarConta() {
    return (
        <CriarContaComponent>
            <RegistroContainer/>
        </CriarContaComponent>
    )
}