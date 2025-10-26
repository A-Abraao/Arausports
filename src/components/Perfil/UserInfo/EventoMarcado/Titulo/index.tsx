import styled from "styled-components";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const DivTitulo = styled.div`
  width: 100%;
`;

/* Título com tipografia totalmente responsiva */
const TituloComponent = styled.h1`
  font-size: clamp(0.95rem, 3.2vw, 1.45rem);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 0.8vw, 0.35rem);
  margin: 0;
  line-height: 1.05; /* mantém o ícone alinhado */

  /* ícone fica proporcional ao texto */
  svg {
    width: clamp(0.95rem, 2.4vw, 1.35rem);
    height: clamp(0.95rem, 2.4vw, 1.35rem);
    flex-shrink: 0;
  }

  /* telas bem pequenas: reduzir ainda mais o tamanho da fonte */
  ${({ theme }) => theme.breakpoints.down("xs")} {
    font-size: clamp(0.85rem, 4.2vw, 1.05rem);
    gap: clamp(0.2rem, 1.3vw, 0.28rem);
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
