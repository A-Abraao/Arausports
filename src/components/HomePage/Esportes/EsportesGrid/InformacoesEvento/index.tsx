import styled from "styled-components";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { BarraDeProgresso } from "./BarraDeProgresso";

const InformacoesEventoComponent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    padding: 1.15em;
    font-size: 0.9em;

     span {
        color: #6E7B8B;
        display: flex;
        align-items: center;
        gap: 0.6em;
        
    }

    .icone {
        color: var(--ring);
    }
`

const Titulo = styled.h2`
    font-weight: 450;
    font-size: 1.25em;
`

const HorarioData = styled.div`
    display: flex;
    align-items: center;
    gap: 1.75em;
    width: 100%;
   
`

type InformacoesEventoProps = {
    titulo: string,
    data: string,
    horario: string,
    localizacao: string,
    capacidade: string

}

export function InformacoesEvento({titulo, data, horario, localizacao, capacidade}: InformacoesEventoProps) {
    return (
        <InformacoesEventoComponent>
            <Titulo>{titulo}</Titulo>

            <HorarioData>
                <span><CalendarTodayIcon className="icone"/>{data}</span>
                <span><AccessTimeIcon className="icone"/>{horario}</span>
            </HorarioData>

            <span><LocationOnIcon className="icone"/>{localizacao}</span>
            <span><PersonIcon className="icone"/>{capacidade}</span>

            <BarraDeProgresso valor={12}/>
            
        </InformacoesEventoComponent>
    )
}