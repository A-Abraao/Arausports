import styled from "styled-components";
import bolaDeBasquetePng from "../../../../assets/img/bola-de-basquete.jpg";
import { Usuario } from "./Usuario";
import { useUserProfile } from "../../../../supabase";
import { useAuth } from "../../../../supabase";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";

const UsuarioBannerComponet = styled.section`
  background: var(--gradient-hero);
  border-radius: 0.5rem;
  display: flex;
  gap: clamp(0.8rem, 2.2vw, 1.8rem);
  padding: clamp(0.9rem, 2.8vw, 2.25rem);
  /* Alinha os itens ao topo em vez do centro */
  align-items: flex-start;
`;

// props da imagem de perfil
interface ImagemDePerfilProps {
  imagem?: string | null;
}

/* Diminuí um pouco o avatar e mantive medidas responsivas */
export const ImagemDePerfil = styled.div<ImagemDePerfilProps>`
  width: clamp(3.5rem, 7.5vw, 6rem);
  height: clamp(3.5rem, 7.5vw, 6rem);
  border-radius: 9999px;
  border: 0.25rem solid rgba(200, 200, 200, 0.5);
  background-image: ${(props) => `url(${props.imagem ?? bolaDeBasquetePng})`};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  margin-top: clamp(0.2rem, 0.8vw, 0.6rem);
`;


export function UsuarioBanner() {
  const { user, session } = useAuth();
  const userId = user?.id ?? session?.user?.id ?? null;

  const { profile: userData, loading } = useUserProfile(userId);

  // fallback dados do auth
  const fallbackName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split?.("@")?.[0] ??
    null;

  const fallbackPhoto =
    (user?.user_metadata && (user.user_metadata.avatar_url ?? user.user_metadata.picture)) ??
    null;

  // determina props finais para passar ao <Usuario />
  const displayName = (() => {
    if (loading) return ""; // enquanto carrega, exibiria dados não prontos ainda
    if (userData?.displayName) return userData.displayName;
    if (fallbackName) return fallbackName;
    return "Sem nome";
  })();

  const bioToShow = (() => {
    if (loading) return ""; // deixe o componente Usuario exibir skeleton se necessário
    // se existe bio na tabela, usa ela
    if (userData?.bio) return userData.bio;
    // se não existe bio, mostrar o texto padrão: "Sou novato gente!"
    return "Sou novato gente!";
  })();

  // Avatar render: enquanto loading, caso contrário passa foto (do profile ou do auth)
  const avatarElement = loading ? (
    <Skeleton variant="circular" width="clamp(3.5rem, 7.5vw, 6rem)" height="clamp(3.5rem, 7.5vw, 6rem)" />
  ) : userData?.photoURL || fallbackPhoto ? (
    <ImagemDePerfil imagem={userData?.photoURL ?? fallbackPhoto ?? undefined} />
  ) : (
    // fallback para Avatar MUI com iniciais (mesmo tamanho responsivo)
    <Avatar sx={{ width: "clamp(3.5rem, 7.5vw, 6rem)", height: "clamp(3.5rem, 7.5vw, 6rem)" }}>
      {String(displayName || "U").charAt(0).toUpperCase()}
    </Avatar>
  );

  return (
    <UsuarioBannerComponet>
      {avatarElement}

      <Box display="flex" flexDirection="column" gap={1} width="100%">
        <Usuario
          name={displayName}
          usuarioBio={bioToShow}
          eventosCriados={String(0)}
          participacoes={String(0)}
          conexoes={String(0)}
        />
      </Box>
    </UsuarioBannerComponet>
  );
}

export default UsuarioBanner;
