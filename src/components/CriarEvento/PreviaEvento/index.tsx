import styled from "styled-components";
import { DetalhesEventoContainer } from "../DetalhesEvento";
import ImageIcon from '@mui/icons-material/Image';
import ImageUpload from "../ImageUpload";
import { PreviaPreviaInformacoes } from "./PreviaInformacoes";

const PreviaEventoContainer = styled(DetalhesEventoContainer)`
  flex: 1 1 48%;
  max-width: clamp(280px, 48%, 560px);
  width: clamp(280px, 40vw, 560px);
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

  /* telas médias */
  @media (max-width: 1100px) {
    max-width: clamp(260px, 46%, 520px);
    min-height: 340px;
    gap: 0.9rem;
  }

  /* telas pequenas: ocupa 100% e fica menor (cria cascata nos filhos) */
  @media (max-width: 900px) {
    flex: 0 0 100%;
    width: 92%;
    max-width: 720px;
    min-height: 14rem; /* reduz a altura para caber melhor em mobile */
    gap: 0.75rem;
    margin: 0 auto;
  }
`;

const Titulo = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.25em;
  font-size: 1.35rem;
  font-weight: 500;
`

type Props = {
  onImageSelect?: (file: File | null) => void;
  existingImageUrl?: string;
};

export function PreviaEvento({ onImageSelect, existingImageUrl }: Props) {
  return (
    <PreviaEventoContainer>
      <div className="secao-titulo">
        <Titulo><ImageIcon/> Previa do evento</Titulo>
        <span className="subtitulo">Deixe a turma ver como vai ser seu evento</span>
      </div>

      <ImageUpload existingImageUrl={existingImageUrl} onUpload={onImageSelect} />
      <PreviaPreviaInformacoes/>
    </PreviaEventoContainer>
  )
}


