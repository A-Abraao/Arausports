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
    padding: 0.65em 1.75em;
    gap: 0.75em;

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
        font-size: 1.25em;
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
                <ArrowIcon width={"1.75em"} height={"1.75em"} />
            </IconButton>
            <h1>Perfil</h1>
        </HeaderComponent>
    );
}
