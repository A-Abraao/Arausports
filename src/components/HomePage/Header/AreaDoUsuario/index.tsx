import styled from "styled-components";
import bolaDeBasqueteUrl from '../../../../assets/img/bola-de-basquete.jpg'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";

const AreaDoUsuarioComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 1.15em;
`

const PerfilImg= styled.img`
    height: 2.55em;
    width: 2.55em;
    border-radius: 100%;
`

export function AreaDoUsuario() {
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

            <PerfilImg src={bolaDeBasqueteUrl}/>
    
        </AreaDoUsuarioComponent>
    )
}