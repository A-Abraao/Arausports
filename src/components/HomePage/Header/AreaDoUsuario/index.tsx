import styled from "styled-components";
import bolaDeBasqueteUrl from '../../../../assets/img/bola-de-basquete.jpg';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { useAuth } from "../../../../supabase";
import { useUserProfile } from "../../../../supabase";

const AreaDoUsuarioComponent = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1.15rem);
`;

const PerfilImg = styled(IconButton)`
  height: clamp(2.9rem, 6.9vw, 3.45rem);
  width: clamp(2.9rem, 6.9vw, 3.45rem);
  border-radius: 100%;
  padding: clamp(2px, 0.6vw, 4px);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
    display: block;
  }
`;

export function AreaDoUsuario() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { profile, error: profileError } = useUserProfile(userId);

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/perfil");
  };

  useEffect(() => {
    if (profileError) console.warn("Erro ao carregar perfil do usuário:", profileError);
  }, [profileError]);

  const photoSrc = profile?.photoURL ?? bolaDeBasqueteUrl;

  return (
    <AreaDoUsuarioComponent>
      <IconButton
        color="primary"
        aria-label="ícone de notificações"
        onClick={() => alert('Você clicou no ícone de sino!')}
        sx={{
          fontSize: 'clamp(20px, 2.5vw, 26px)',
        }}
      >
        <NotificationsIcon sx={{
          fontSize: 'inherit',
          color: "var(--ring)",
        }} />
      </IconButton>

      <PerfilImg onClick={handleNavigate} aria-label="abrir perfil">
        <img src={photoSrc} alt="Perfil" />
      </PerfilImg>
    </AreaDoUsuarioComponent>
  );
}
