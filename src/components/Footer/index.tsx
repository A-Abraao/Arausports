import styled from "styled-components";

//componente do radape
const FooterComponent = styled.footer`
  width: 100%;
  box-sizing: border-box;
  background: var(--gradient-rodape);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.6rem, 1.6vw, 1.25rem); /* espaçamento responsivo em vez de height fixo */
  box-shadow: 0 -4px 10px -4px rgba(0, 0, 0, 0.3);
  text-align: center;

  /* garante que o conteúdo não fique gigantesco em telas muito largas */
  & > .wrap {
    width: 100%;
    max-width: 1100px;
    padding: 0 1rem;
  }


  .copy {
    font-weight: 510;
    color: white;
  }

  h2 {
    margin: 0;
    font-weight: 550;
    color: white;
    

    /* diminui no mobile, cresce em telas maiores */
    font-size: clamp(0.85rem, 1.6vw, 1.05rem);
    line-height: 1.35;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  /*  menos sombra em mobile para sensação mais leve */
  @media (max-width: 420px) {
    box-shadow: 0 -2px 6px -3px rgba(0,0,0,0.18);
  }
`;

//rednerizar o rodpae
export function Footer() {
  return (
    <FooterComponent>
      <div className="wrap">
        <div className="contato">
          <h2>
            CONTATO
          </h2>
        </div>

        <div className="sobre">
          <h2>
            SOBRE
          </h2>

          <div className="copyright">
            <p className="copy">
              &copy; <span>2025</span> Arausports &bull; Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </FooterComponent>
  );
}
