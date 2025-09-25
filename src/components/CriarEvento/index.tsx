import styled from "styled-components";
import { HeaderComponent } from "../Perfil/Header";
import VoltarSetinha from '../../assets/img/retornar-setinha.svg?react'
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Titulo } from "./Titulo";
import { DetalhesEvento } from "./DetalhesEvento";
import { Button } from "@mui/material";

const CriarEventoComponent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75em;
`

const Header = styled(HeaderComponent)`

`

const InformacoesEvento = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1em;
`


export function CriarEvento() {
    const navigate = useNavigate()

    return (
        <div>
            <Header>
                <IconButton onClick={() => navigate("/perfil")}>
                    <VoltarSetinha width={"1.75em"} height={"1.75em"}/>
                </IconButton>
                <h1>Criar Evento</h1>
            </Header>

            <CriarEventoComponent>
                <Titulo/>
                <InformacoesEvento>
                    <DetalhesEvento/>
                </InformacoesEvento>
                <Button
                sx={{
                    width: "22%",
                    textTransform: "none",
                    background: "var(--gradient-hero)",
                    color: "white",
                    padding: "0.25em 0.25em",
                    fontWeight: "550",
                    fontSize: "1em",
                    marginTop: "1.15em",
                }}
                >Criar Evento</Button>
            </CriarEventoComponent>
        </div>
    )
}