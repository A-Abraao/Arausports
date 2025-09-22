import styled from "styled-components";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ButtonDeAcao } from "../MaisDetalhesButton";

const InformacoesEventoComponent = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 1em; 

    .divEncapsuladora {
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        flex: 1; 
        min-width: 0;
`

export const TituloEvento = styled.h2`
    font-size: 1.25em;
    font-weight: extralight;
    `
    
const EventoInfo = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.95em;
    flex-wrap: wrap;
    gap: 1em;
    
    span {
        color: var(--cinza);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.25em;
    }

`

export function InformacoesEvento() {
    return (
        <InformacoesEventoComponent>
            <div className="divEncapsuladora">
                <TituloEvento>Aquela partida de fut lá</TituloEvento>
                <EventoInfo>
                    <span><CalendarMonthIcon fontSize="small"/>23 de março, 2025</span>
                    <span><LocationOnIcon fontSize="small"/>Parque cachoeira</span>
                </EventoInfo>
            </div>
            <div>
                <ButtonDeAcao>Mais detalhes</ButtonDeAcao>

            </div>
            
        </InformacoesEventoComponent>
    )
}