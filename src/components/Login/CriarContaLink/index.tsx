import styled from 'styled-components'
import { Link } from 'react-router-dom'

const CriarContaLinkComponent = styled(Link)`
    color: dodgerblue;
    text-decoration: none;
    font-weight: bold;
    font-size: 0.65em;
    &:hover {
        text-decoration: underline;
    }
`

function CriarContaLink() {
    return (
        <CriarContaLinkComponent to={"/criar-conta"}>Criar conta</CriarContaLinkComponent>
    )
}

export default CriarContaLink