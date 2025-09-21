import styled from "styled-components";
import { TituloEvento } from "../../EventoMarcado/InformacoesEvento";

const TextosComponent = styled.div`
    display: flex;
    
    .textos-div {
        display: flex;
        flex-direction: column;
        gap: 0.65em;
    }
    
`


export default function Textos() {
    return (
        <TextosComponent>
            <div className="textos-div">
                <TituloEvento>Pronto para seu próximo role?</TituloEvento>
                <p>Crie e compartilhe seu próximo evento para a rapaziada</p>
            </div>
        </TextosComponent>
    )
}