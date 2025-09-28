import styled from "styled-components";
import { Banner } from "./Banner";
import Formulario from "./Formulario";

const RegistroContainerComponent = styled.div`
    border-radius: 1em;
    background: white;
    align-items: center;
    width: 100%;
    height: 100%;
    display: flex;
    border: 1px solid #ddd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 1em;
`

export function RegistroContainer() {
    return (    
        <RegistroContainerComponent>
            <Banner/>
            <Formulario/>
        </RegistroContainerComponent>
    )
}
