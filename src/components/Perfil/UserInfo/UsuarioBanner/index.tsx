import styled from "styled-components";
import bolaDeBasquetePng from '../../../../assets/img/bola-de-basquete.jpg'
import { Usuario } from "./Usuario";
import { useAuth } from "../../../../contexts/AuthContext";

const UsuarioBannerComponet = styled.section`
  background: var(--gradient-hero);
  border-radius: 0.5rem; /* troquei 0.5em -> 0.5rem */
  display: flex;
  gap: clamp(0.8rem, 2.2vw, 1.8rem);
  padding: clamp(0.9rem, 2.8vw, 2.25rem);
  align-items: center;
`;

interface ImagemDePerfilProps {
  imagem?: string | null;
}

export const ImagemDePerfil = styled.div<ImagemDePerfilProps>`
  width: clamp(4rem, 9vw, 7rem);
  height: clamp(4rem, 9vw, 7rem);
  border-radius: 9999px;
  border: 0.25rem solid rgba(200, 200, 200, 0.5);
  background-image: ${props => `url(${props.imagem ?? bolaDeBasquetePng})`};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export function UsuarioBanner() {
  const { userData, loading } = useAuth();


  let userName;
  let userBio

  if (loading) {
    userName = "carregando perai...";
    userBio = "calma lá!!";
  } else if (!userData) {
    userName = "Nada encontrado.."; 
    userBio = "Hum.. parece que seu registro está deveras estranho."
  } else {
    
    userName = userData.displayName ?? "Sem nome";
    userBio = userData.bio ?? "E sem biografia tbm.."
  }

  return (
    <UsuarioBannerComponet>
      <ImagemDePerfil imagem={userData?.photoURL ?? undefined}/>
      <Usuario
        name={userName}
        usuarioBio={userBio}
        eventosCriados={String(userData?.eventosCriados ?? 0)}
        participacoes={String(userData?.participacoes ?? 0)}
        conexoes={String(userData?.conexoes ?? 0)}
      />
    </UsuarioBannerComponet>
  );
}
