import styled from "styled-components";
import { HeaderComponent } from "../Perfil/Header";
import VoltarSetinha from '../../assets/img/retornar-setinha.svg?react'
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Titulo } from "./Titulo";
import { DetalhesEvento } from "./DetalhesEvento";

const CriarEventoComponent = styled.div`
   
`

const Header = styled(HeaderComponent)`

`

const InformacoesEvento = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1.5em;
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
            </CriarEventoComponent>
        </div>
    )
}