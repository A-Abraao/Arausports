import styled from "styled-components";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const DivTitulo = styled.div`
  width: 100%;
`;

const TituloComponent = styled.h1`
  font-size: clamp(1rem, 2.6vw, 1.45rem);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 0.8vw, 0.35rem);
  
  /* ícone fica proporcional ao texto */
  svg {
    width: clamp(1rem, 2.4vw, 1.35rem);
    height: clamp(1rem, 2.4vw, 1.35rem);
  }
`;

export function Titulo() {
  return (
    <DivTitulo>
      <TituloComponent>
        <TipsAndUpdatesIcon />
        Dica importante
      </TituloComponent>
    </DivTitulo>
  );
}
