import styled from "styled-components";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DivTitulo = styled.div`
    width: 100%;
`

const TituloComponent = styled.h1`
    font-size: 1.75em;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.35em;
`

export function Titulo() {
    return (
        <DivTitulo>
            <TituloComponent><AccessTimeIcon/>Próximo evento</TituloComponent>
        </DivTitulo>
    )
}