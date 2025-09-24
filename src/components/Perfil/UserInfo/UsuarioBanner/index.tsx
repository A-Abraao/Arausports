import styled from "styled-components";
import ImagemDePerfilSrc from '../../../../assets/img/bola-de-basquete.jpg'
import { Usuario } from "./Usuario";
import { useAuth } from "../../../../contexts/AuthContext";
import { getUserProfile } from "../../../../contexts/pegarDadosUsuario";
import { useEffect, useState } from "react";

const UsuarioBannerComponet = styled.section`
    background: var(--gradient-hero);
    border-radius: 0.5em;
    display: flex;
    gap: 1.8em;
    padding: 2.25em;
`
interface ImagemDePerfilProps {
    imagem?: string;
}

export const ImagemDePerfil = styled.div<ImagemDePerfilProps>`
    width: 7em;   
    height: 7em;
    border-radius: 9999px;
    border: 0.25em solid #rgba(200, 200, 200, 0.5);
    background-image: url(${props => props.imagem || ImagemDePerfilSrc});
    background-size: cover;  
    background-position: center; 
`

export function UsuarioBanner() {
    const { userData } = useAuth(); 
    const photoURL = userData?.photoURL || ImagemDePerfilSrc;
    const userName = userData?.displayName || "New User";

    return (
        <UsuarioBannerComponet>
            <ImagemDePerfil imagem={photoURL}/>
            <Usuario name={userName} />
        </UsuarioBannerComponet>
    )
}

