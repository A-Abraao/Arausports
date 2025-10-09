import styled from "styled-components";
import BannerPesquisa from "./BannerPesquisa";

const BannerComponent = styled.div`
  align-items: center;
  background: var(--gradient-hero);
  color: white;
  display: flex;

  min-height: 80dvh;
  min-height: calc(var(--vh, 1vh) * 80);
  min-height: 80vh;
  padding: clamp(1rem, 3.5vw, 2.5rem) clamp(1.5rem, 12vw, 25%);

  p {
    font-size: clamp(0.9rem, 1.6vw, 1.02rem);
    font-weight: 420;
    margin: 0;
  }
`;

const DivEncapsuladora = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: clamp(0.8rem, 2.2vw, 1.4rem);
  text-align: center;
  justify-content: center;
  width: 100%;
  max-width: clamp(320px, 70vw, 1100px);
  margin: 0 auto;
  padding: 0;
`;

const Titulo = styled.h1`
  font-size: clamp(1.6rem, 6.2vw, 2.8rem);
  line-height: 1;
  margin: 0;

  .destaque {
    background-image: linear-gradient(to right, rgb(253 230 138), rgb(253 186 116));
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
`;

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  onSearch?: () => void;
};

export function Banner({ value = "", onChange, onSearch }: Props) {
  return (
    <BannerComponent>
      <DivEncapsuladora>
        <Titulo>
          Encontre sua próxima <span className="destaque">aventura esportiva</span>
        </Titulo>
        <p>Encontre eventos locais, conheça pessoas novas e se torne ativo na comunidade.</p>

        <BannerPesquisa
          value={value}
          onChange={onChange}
          onSearch={(q) => {
            onSearch?.();
          }}
        />
      </DivEncapsuladora>
    </BannerComponent>
  );
}
