import styled from "styled-components"

const DivSuperior = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.60em;

    span {
        color: #696969;
        font-weight: 450;
    }
`

const Titulo = styled.h1`
    font-size: 2.05em;
    font-weight: bold;
`

export function SecaoSuperior() {
    return (
        <DivSuperior>
            <Titulo>Eventos disponíveis</Titulo>
            <span>6 eventos</span>
        </DivSuperior>
    )
}