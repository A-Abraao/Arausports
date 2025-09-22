import styled from "styled-components";
import ImagemDePerfilSrc from '../../../../assets/img/bola-de-basquete.jpg'
import { Usuario } from "./Usuario";

const UsuarioBannerComponet = styled.section`
    background: var(--gradient-hero);
    border-radius: 0.5em;
    display: flex;
    gap: 1.8em;
    padding: 2.25em;
`

export const ImagemDePerfil = styled.div`
    width: 7em;   
    height: 7em;
    border-radius: 9999px;
    border: 0.25em solid #rgba(200, 200, 200, 0.5);
    background-image: url(${ImagemDePerfilSrc});
    background-size: cover;  
    background-position: center; 
`

export function UsuarioBanner() {
    return (
        <UsuarioBannerComponet>
            <ImagemDePerfil />
            <Usuario/>
        </UsuarioBannerComponet>
    )
}
