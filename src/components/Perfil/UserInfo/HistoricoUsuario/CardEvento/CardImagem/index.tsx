// CardImagem/index.tsx (debug - img tag)
import styled from "styled-components";
import ImagemEvento from '../../../../../../assets/img/evento-de-futebol.jpg';

const Wrapper = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 95);
  border-radius: 0.5rem;
  overflow: hidden;
  background: #eee;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export function CardImagem({ imageUrl }: { imageUrl?: string | null }) {
  const src = imageUrl ?? ImagemEvento;
  return (
    <Wrapper>
      <StyledImg src={src} alt="evento" loading="lazy" />
    </Wrapper>
  );
}
