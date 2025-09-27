import styled from "styled-components";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PersonIcon from '@mui/icons-material/Person';
import { useMemo } from "react";
import { BarraDeProgresso } from "../../../HomePage/Esportes/EsportesGrid/InformacoesEvento/BarraDeProgresso";

const PreviaInformacoesContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* aumentado de 1rem para 1.5rem */
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow:
    0 8px 22px rgba(2,6,23,0.04),
    0 2px 6px rgba(2,6,23,0.03);

  transition: none;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--foreground, #0f172a);
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* aumentado de 0.5rem para 0.75rem */
    width: 100%;
  }

  .meta span {
    color: #6E7B8B;
    display: flex;
    align-items: center;
    gap: 0.8rem; /* aumentado de 0.6rem para 0.8rem */
    font-size: 0.95rem;
  }

  .icone {
    color: var(--ring);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
  }

  @media (max-width: 720px) {
    padding: 1rem;
    h2 { font-size: 1.1rem; }
    .meta span { font-size: 0.92rem; }
  }
`;

type Props = {
  titulo?: string;
  data?: string;    
  horario?: string;  
  local?: string;
  capacidadeMaxima?: number;
  participantesAtuais?: number;
};

export function PreviaPreviaInformacoes({
  titulo = "Titulo do evento",
  data = "17-09-2025",
  horario = "12:00",
  local = "Local do evento",
  capacidadeMaxima = 10,
  participantesAtuais = 6,
}: Props) {
  const max = useMemo(() => Math.max(1, capacidadeMaxima), [capacidadeMaxima]);
  const atual = useMemo(() => Math.max(0, participantesAtuais), [participantesAtuais]);
  const percentual = useMemo(() => Math.min(100, Math.round((atual / max) * 100)), [atual, max]);

  return (
    <PreviaInformacoesContainer>
      <h2>{titulo}</h2>

      <div className="meta">
        <span>
          <CalendarTodayIcon className="icone" /> {data} <AccessTimeIcon className="icone" style={{ marginLeft: 12 }} /> {horario}
        </span>

        <span>
          <LocationPinIcon className="icone" /> {local}
        </span>

        <span>
          <PersonIcon className="icone" /> {`${max} pessoas`}
        </span>

        
        <div style={{ marginTop: 12 }}>
          <BarraDeProgresso valor={percentual} />
        </div>
      </div>
    </PreviaInformacoesContainer>
  );
}
