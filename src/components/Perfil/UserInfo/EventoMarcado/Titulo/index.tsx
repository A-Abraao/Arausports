import styled from "styled-components";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const DivTitulo = styled.div`
    width: 100%;
`

const TituloComponent = styled.h1`
    font-size: 1.45em;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.35em;
`

export function Titulo() {
    return (
        <DivTitulo>
            <TituloComponent><TipsAndUpdatesIcon/>Dica importante</TituloComponent>
        </DivTitulo>
    )
}