import styled from "styled-components"

const DivSuperior = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0em 1.75em 0em 1.75em;
    

    span {
        color: #696969;
        font-weight: 450;
    }
`

const Titulo = styled.h1`
    font-size: 2.05em;
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