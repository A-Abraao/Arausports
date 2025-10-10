import styled from "styled-components";
import bolaDeBasqueteUrl from '../../../../assets/img/bola-de-basquete.jpg';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { onAuthListener, useGetProfilePhoto } from "../../../../firebase";

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
  const [ userId, setUserId ] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthListener((user) => {
      setUserId(user ? user.uid : null)
    })

    return () => unsubscribe()
  }, [])

  const { userPhoto, erro } = useGetProfilePhoto(userId)

  if (erro) console.log("deu erro" + erro)

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/perfil");
  };

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

      <PerfilImg onClick={handleNavigate}>
        <img src={userPhoto || bolaDeBasqueteUrl} alt="Perfil" />
      </PerfilImg>
    </AreaDoUsuarioComponent>
  );
}
