import styled from "styled-components"

const DivSuperior = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  /* centraliza o conteúdo e garante padding simétrico nas laterais */
  width: 100%;
  max-width: clamp(360px, 90vw, 1100px);
  margin: 0 auto;
  padding-inline: clamp(0.6rem, 1.8vw, 1.25rem);
  box-sizing: border-box;

  /* reduzir altura vertical para evitar sensação de deslocamento central */
  padding-top: 0;
  padding-bottom: 0;

  /* tipografia do contador (lado direito) */
  span {
    color: var(--muted-foreground);
    font-weight: 450;
    font-size: clamp(0.85rem, 1.2vw, 0.98rem);
    white-space: nowrap;
  }

  /* em telas bem pequenas permitir quebra visual se necessário */
  ${({ theme }) => theme.breakpoints.down("xs" as any)} {
    padding-inline: 0.6rem;
    gap: 0.5rem;
  }
`;

const Titulo = styled.h1`
  font-size: clamp(1.05rem, 3.2vw, 1.8rem); /* menor max para não ficar gigante em desktop */
  font-weight: 700;
  margin: 0;
  line-height: 1.05;
  word-break: break-word;
  overflow-wrap: anywhere; /* força o título a se ajustar e quebrar quando necessário */
  display: block;
  display: inline-block;
  width: auto;

  /* garante que o título não fique deslocado para o centro por causa de paddings */
  text-align: left;

  /* destaque mantém o mesmo visual */
  .destaque {
    background-image: linear-gradient(to right, rgb(253 230 138), rgb(253 186 116));
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }

  /* em telas muito estreitas reduz ainda mais o tamanho */
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: clamp(0.95rem, 4.6vw, 1.25rem);
    text-align: center; /* em mobile a estética central funciona melhor */
  }
`;

type Props = {
    count: number
}

export function SecaoSuperior({count}:Props) {
    const texto = count === 1 ? "1 evento" : `${count} eventos`

    return (
        <DivSuperior>
            <Titulo>Eventos disponíveis</Titulo>
            <span>{count === 0 ? "Nenhum evento" : texto}</span>
        </DivSuperior>
    )
}
