import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowIcon from "../../../assets/img/retornar-setinha.svg?react"

export const HeaderComponent = styled.header`
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);
    gap: 1.25em; 
    padding: 0.75em;
    display: flex;

    -webkit-backdrop-filter: blur(8px);

    svg {
        cursor: pointer;
    }

    h1 {
        background: var(--gradient-hero);
        font-weight: bold;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        font-size: 1.15em;
    }
`

export function Header() {

    const navigate = useNavigate()

    const handleVoltar = () => {
        navigate("/homepage")
    }

    return (
        <HeaderComponent>
            <IconButton onClick={handleVoltar}>
                <ArrowIcon width={"1.75em"} height={"1.75em"} />
            </IconButton><h1>Perfil</h1>
        </HeaderComponent>
    )
}