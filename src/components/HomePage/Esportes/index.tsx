import styled from "styled-components";
import { SecaoSuperior } from "./SecaoSuperior";
import { EsportesGrid } from "./EsportesGrid";

const EsportesSectionComponent = styled.section`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1.75em 2.15em;
    gap: 2em;
    margin-top: 1.40em;

`

export function Esportes() {
    return (
        <EsportesSectionComponent>
            <SecaoSuperior/>
            <EsportesGrid/>
        </EsportesSectionComponent>
    )
}