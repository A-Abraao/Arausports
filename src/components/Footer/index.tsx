import styled from "styled-components";
import EmailSvg from '../../assets/img/email-svgr.svg?react'
import PhoneSvg from '../../assets/img/phone-svgr.svg?react'

//componente do radape
const FooterComponent = styled.footer`
  width: 100%;
  box-sizing: border-box;
  background: var(--gradient-rodape);
  display: flex;
  flex-direction: column;
  font-weight: 550;
  gap: 2.05em;
  color: white;
  align-items: center;
  justify-content: center;
  padding: clamp(0.6rem, 1.6vw, 1.25rem); /* espaçamento responsivo em vez de height fixo */
  box-shadow: 0 -4px 10px -4px rgba(0, 0, 0, 0.3);
  text-align: center;

  /* garante que o conteúdo não fique gigantesco em telas muito largas */
  & > .wrap {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 2.5em;
    max-width: 1100px;
    padding: 0 1rem;
  }

  .copyright {
    padding-top: 0.55em;
    width: 55%;
    border-top: 1px solid oklch(86.9% 0.005 56.366);
  }

  .copy {
    text-align: center;
    font-weight: 510;
    color: white;
  }

  h2 {
    margin-right: 1.4em;
    margin: 0;
    margin-bottom: 0.55em;


    /* diminui no mobile, cresce em telas maiores */
    font-size: clamp(1.1rem, 2vw, 1.3rem);
    line-height: 1.35;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  /*  menos sombra em mobile para sensação mais leve */
  @media (max-width: 420px) {
    box-shadow: 0 -2px 6px -3px rgba(0,0,0,0.18);
  }

  .sobre {
    width: 28%;
  }

  .sobre, contato {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 0.95em;
    text-align: left;
    font-weight: 
  }
`;

const ListaContato = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2em;
  flex-direction: column;
  justify-content: flex-start;

  li {
    gap: 0.65em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.9em;

    &:hover {
      color: oklch(91.7% 0.08 205.041);
    }
  }
  
`

//rednerizar o rodpae
export function Footer() {
  return (
    <FooterComponent>
      <div className="wrap">

        <div className="sobre">
          <h2>
            SOBRE
          </h2>
            <p>Somos um site dedicado à divulgação de eventos esportivos que acontecem na cidade de <strong>Araucária</strong></p>
        </div>

        <div className="contato">
          <h2>
            CONTATO
          </h2>

          <ListaContato>
              <li><EmailSvg/>arausports.suporte@gmail.com</li>
              <li><PhoneSvg/>41 99693-9374</li>
          </ListaContato>

        </div>

      </div>

      < div className="copyright">
        <p className="copy">
            &copy; <span>2025</span> Arausports &bull; Todos os direitos reservados.
          </p>
        </div>
    </FooterComponent>
  );
}
