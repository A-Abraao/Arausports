import styled from "styled-components"

const DivSuperior = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(0.75rem, 1.8vw, 1.75rem);
    
    span {
        color: #696969;
        font-weight: 450;
    }
`

const Titulo = styled.h1`
    font-size: clamp(1.25rem, 2.2vw, 2.05rem);
    font-weight: bold;
`

type Props = {
    count: number
}

export function SecaoSuperior({count}:Props) {
    const texto = count === 1 ? "1 evento" : `${count} eventos`

    return (
        <DivSuperior>
            <Titulo>Eventos disponíveis</Titulo>
            <span>{count === 0 ? "Nenhum evento" : texto}</span>
        </DivSuperior>
    )
}
