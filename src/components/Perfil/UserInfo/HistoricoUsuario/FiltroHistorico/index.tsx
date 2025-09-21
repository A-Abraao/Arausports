import styled from "styled-components";

const FiltroHistoricoComponent = styled.div`
    margin-top: 1px solid rgba(0, 0, 0, 0.7);
    diplay: flex;
`

const Opcao = styled.button`
    padding: 0.75em;
    color: var(--cinza);
    border-radius: 0.25em;
    cursor: pointer;

    &:active {
        color: white;
        border: 1px solid rgba(0, 0, 0, 0.7);
    }
`

export function FiltroHistorico() {
    return (
        <FiltroHistoricoComponent>
            <Opcao>Meus eventos</Opcao>
            <Opcao>Eventos salvos</Opcao>
            <Opcao>Próximos eventos</Opcao>
        </FiltroHistoricoComponent>
    )
}