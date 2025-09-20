import styled from "styled-components";
import bolaDeBasqueteUrl from '../../../../assets/img/bola-de-basquete.jpg'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";

const AreaDoUsuarioComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 1.15em;
`

const PerfilImg= styled(IconButton)`
    height: 2.55em;
    width: 2.55em;
    border-radius: 100%;
    padding: 1px; 
    overflow: hidden;

    img {
        width: 1.85em;
        height: 1.85em;
        border-radius: 100%;
        object-fit: cover;
    }
`

export function AreaDoUsuario() {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate("/perfil")
    }

    return (
        <AreaDoUsuarioComponent>
            <IconButton
                color="primary"
                aria-label="ícone de notificações"
                onClick={() => alert('Você clicou no ícone de sino!')}
                >
                
                <NotificationsIcon sx={{ 
                    fontSize: 26,
                    color: "var(--ring)",
                    }} />
            </IconButton>

            <PerfilImg onClick={handleNavigate}>
                <img src={bolaDeBasqueteUrl} alt="Perfil" />
            </PerfilImg>
    
        </AreaDoUsuarioComponent>
    )
}