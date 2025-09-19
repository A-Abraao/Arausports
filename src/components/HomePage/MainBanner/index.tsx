import styled from "styled-components";
import BannerPesquisa from "./BannerPesquisa";

//banner que vai ficar logo abaixo do header
const BannerComponent = styled.div`
    align-items: center;
    background: var(--gradient-hero);
    color: white;
    display: flex;
    height: calc(100vh - 20vh);
    padding: 5% 25%;

    p {
        font-size: 1.02em;
        font-weight: 420;
    }
    
`

// div que vai encapsular componentes como o titulo e a barra de pesquisa embaixo
const DivEncapsuladora = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1.4em;
    text-align: center;
    justify-content: center;
`

//texto grande que aparece dentro do banner
const Titulo = styled.h1`
    font-size: 2.8em;
    line-height: 1;

    .destaque {
        background-image: linear-gradient(to right, rgb(253, 230, 138), rgb(253, 186, 116));
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
    }
`

export function Banner() {
    return (
        <BannerComponent>
            <DivEncapsuladora>
                <Titulo>Encontre sua próxima <span className="destaque">aventura esportiva</span></Titulo>
                <p>Encontre eventos locais, conheça pessoas novas e se torne ativo na comunidade.</p>

                <BannerPesquisa/>
            </DivEncapsuladora>
        </BannerComponent>
    )
}