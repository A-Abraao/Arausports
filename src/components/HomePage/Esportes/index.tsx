import styled from "styled-components";
import { SecaoSuperior } from "./SecaoSuperior";

const EsportesSectionComponent = styled.section`

    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1.75em 2.15em;
    gap: 0.5em

`

export function Esportes() {
    return (
        <EsportesSectionComponent>
            <SecaoSuperior/>
        </EsportesSectionComponent>
    )
}