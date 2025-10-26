import styled from "styled-components";
import BannerPesquisa from "./BannerPesquisa";

const BannerComponent = styled.div`
  align-items: center;
  background: var(--gradient-hero);
  color: white;
  display: flex;
  min-height: calc(var(--vh, 1vh) * 80);
  padding: clamp(1rem, 3.2vw, 2rem) clamp(1rem, 8vw, 12%);
  box-sizing: border-box;

  p {
    font-size: clamp(0.85rem, 1.3vw, 1rem);
    font-weight: 420;
    margin: 0;
  }

  /* em telas muito estreitas reduzir padding lateral para evitar encurtamento extremo */
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding-left: clamp(0.8rem, 4vw, 1rem);
    padding-right: clamp(0.8rem, 4vw, 1rem);
  }
`;

const DivEncapsuladora = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: clamp(0.6rem, 1.8vw, 1.2rem);
  text-align: center;
  justify-content: center;
  width: 100%;
  max-width: clamp(360px, 70vw, 1100px);
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
`;

const Titulo = styled.h1`
  font-size: clamp(1.2rem, 5vw, 2.4rem);
  line-height: 1.05;
  margin: 0;
  word-break: break-word;

  .destaque {
    background-image: linear-gradient(to right, rgb(253 230 138), rgb(253 186 116));
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }

  /* se o container ficar muito estreito, reduzir ainda mais o texto para evitar encurtamento */
  ${({ theme }) => theme.breakpoints.down("xs" as any)} {
    font-size: clamp(1rem, 7.5vw, 1.6rem);
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
