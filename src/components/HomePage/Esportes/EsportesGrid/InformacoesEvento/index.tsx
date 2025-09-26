import styled from "styled-components";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { BarraDeProgresso } from "./BarraDeProgresso";
import { EntrarBt } from "./EntrarBt";

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
`;

type TituloProps = {
  hoverTitulo: boolean;
};

const Titulo = styled.h2<TituloProps>`
  font-weight: 450;
  font-size: 1.25em;
  color: ${(props) => (props.hoverTitulo ? "var(--gradient-primary)" : "black")};
  transition: color 0.3s ease;
`;

const HorarioData = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75em;
  width: 100%;
`;

type InformacoesEventoProps = {
  titulo: string;
  data: string;
  horario: string;
  localizacao: string;
  capacidadeMaxima: number;
  participantesAtuais: number;
  hoverTitulo: boolean;
};

export function InformacoesEvento({
  titulo,
  data,
  horario,
  localizacao,
  capacidadeMaxima,
  participantesAtuais,
  hoverTitulo,
}: InformacoesEventoProps) {
  
  const max = Math.max(1, capacidadeMaxima || 1);
  const atual = Math.max(0, participantesAtuais || 0);
  const percentual = Math.min(100, Math.round((atual / max) * 100));

  return (
    <InformacoesEventoComponent>
      <Titulo hoverTitulo={hoverTitulo}>{titulo}</Titulo>

      <HorarioData>
        <span><CalendarTodayIcon className="icone" />{data}</span>
        <span><AccessTimeIcon className="icone" />{horario}</span>
      </HorarioData>

      <span><LocationOnIcon className="icone" />{localizacao}</span>

     
      <span><PersonIcon className="icone" />{`${atual} / ${capacidadeMaxima} participantes`}</span>

      
      <BarraDeProgresso valor={percentual} />

      <EntrarBt />
    </InformacoesEventoComponent>
  );
}
