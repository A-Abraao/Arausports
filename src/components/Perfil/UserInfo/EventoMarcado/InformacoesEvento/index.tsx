import styled from "styled-components";

const InformacoesEventoComponent = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 1em; 

    .divEncapsuladora {
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        flex: 1; 
        min-width: 0;
`

export const TituloEvento = styled.h2`
    font-size: 1.05em;
    font-weight: extralight;
    `
    

export function InformacoesEvento() {
    return (
        <InformacoesEventoComponent>
            <div className="divEncapsuladora">
                <TituloEvento>Tente deixar seu perfil confiável e estiloso para galera poder criar conexão e credibilidade com sua pessoa</TituloEvento>
            </div>
        </InformacoesEventoComponent>
    )
}