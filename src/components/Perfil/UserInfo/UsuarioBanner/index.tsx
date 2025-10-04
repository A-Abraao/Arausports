import styled from "styled-components";
import bolaDeBasquetePng from '../../../../assets/img/bola-de-basquete.jpg'
import { Usuario } from "./Usuario";
import { useAuth } from "../../../../contexts/AuthContext";

const UsuarioBannerComponet = styled.section`
  background: var(--gradient-hero);
  border-radius: 0.5em;
  display: flex;
  gap: 1.8em;
  padding: 2.25em;
`;

interface ImagemDePerfilProps {
  imagem?: string | null;
}

export const ImagemDePerfil = styled.div<ImagemDePerfilProps>`
  width: 7em;
  height: 7em;
  border-radius: 9999px;
  border: 0.25em solid rgba(200, 200, 200, 0.5);
  background-image: ${props => `url(${props.imagem ?? bolaDeBasquetePng})`};
  background-size: cover;
  background-position: center;
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
