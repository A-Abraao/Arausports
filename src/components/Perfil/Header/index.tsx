import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowIcon from "../../../assets/img/retornar-setinha.svg?react";

export const HeaderComponent = styled.header`
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;

    width: 100%;
    /* padding responsivo (vertical minimo 0.5rem, max ~1rem; horizontal entre 1rem e 2rem) */
    padding: clamp(0.45rem, 1.2vh, 0.9rem) clamp(0.75rem, 2.2vw, 1.75rem);
    gap: clamp(0.45rem, 1.2vw, 0.75rem);

    border-bottom: 1px solid #e5e7eb;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    svg {
        cursor: pointer;
    }

    h1 {
        background: var(--gradient-hero);
        font-weight: bold;
        /* font-size responsivo: minimo 1rem, preferido ~1.25rem */
        font-size: clamp(1rem, 2.6vw, 1.25rem);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
    }
`;

export function Header() {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate("/homepage");
    };

    return (
        <HeaderComponent>
            <IconButton onClick={handleVoltar}>
                <ArrowIcon width={"1.75rem"} height={"1.75rem"} />
            </IconButton>
            <h1>Perfil</h1>
        </HeaderComponent>
    );
}
