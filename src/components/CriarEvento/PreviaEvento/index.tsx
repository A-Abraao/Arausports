import styled from "styled-components";
import { DetalhesEventoContainer } from "../DetalhesEvento";
import ImageIcon from '@mui/icons-material/Image';
import ImageUpload from "../ImageUpload";
import { PreviaPreviaInformacoes } from "./PreviaInformacoes";

const PreviaEventoContainer = styled(DetalhesEventoContainer)`
    width: 100%;
    min-height: 400px;
    height: auto;
    gap: 1em;
    display: flex;
    flex-direction: column;

    
    & > * {
      flex: 0 0 auto;
    }

    .secao-titulo {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
    }

    .subtitulo {
        color: var(--muted-foreground);
        font-weight: 450;
        font-size: 0.9em;
    }
`;


const Titulo = styled.h2`
    display: flex;
    align-items: center;
    gap: 0.25em;
    font-size: 1.35rem;
    font-weight: 500;
`

export function PreviaEvento() {
    return (
        <PreviaEventoContainer>
            <div className="secao-titulo">
                <Titulo><ImageIcon/> Previa do evento</Titulo>
                <span className="subtitulo">Deixe a turma ver como vai ser seu evento</span>
            </div>
            <ImageUpload/>
            <PreviaPreviaInformacoes/>
        </PreviaEventoContainer>
    )
}