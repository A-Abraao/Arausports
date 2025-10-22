import { VerificaEmailFormulario } from './VerificaEmailFormulario'
import styled from 'styled-components'

const PageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 80vh;
    padding: 2rem;
    box-sizing: border-box;
`

export default function VerificarEmailPage() {
    return (
        <PageWrapper>
            <VerificaEmailFormulario />
        </PageWrapper>
    )
}