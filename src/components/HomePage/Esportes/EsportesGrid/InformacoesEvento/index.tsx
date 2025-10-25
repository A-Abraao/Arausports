import styled from "styled-components";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { BarraDeProgresso } from "./BarraDeProgresso";
import { formatDateBR } from "../../../../../supabase";
import { EntrarBt } from "./EntrarBt";
import { useEventProgress } from "../../../../../supabase";

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
  gap: 2.5em;
  width: 100%;
`;

type InformacoesEventoProps = {
  titulo: string;
  data: string | Date | null;
  horario: string;
  localizacao: string;
  capacidadeMaxima: number;
  participantesAtuais: number;
  hoverTitulo: boolean;
  eventoId: string;
  ownerId?: string;
};

export function InformacoesEvento({
  titulo,
  data,
  horario,
  localizacao,
  capacidadeMaxima,
  eventoId,
  participantesAtuais,
  hoverTitulo,
  ownerId,
}: InformacoesEventoProps) {
  const formatSafe = (d: string | Date | null) => {
    if (!d) return "data não informada";
    try {
      if (d instanceof Date) return formatDateBR(d);
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) return formatDateBR(parsed);
      return String(d);
    } catch (err) {
      return typeof d === "string" ? d : (d as any)?.toString?.() ?? "data inválida";
    }
  };

  // hook realtime: fornece liveParticipantes, liveCapacidade e livePercentual
  const { participantesAtuais: liveParticipantes, capacidade: liveCapacidade, percentual: livePercentual } =
    useEventProgress(eventoId);

    const atual = liveParticipantes ?? participantesAtuais;
    const max = liveCapacidade ?? capacidadeMaxima;
    const percentual = livePercentual ?? (Math.min(100, Math.round((atual / Math.max(1, max)) * 100)));


  // exibir capacidade visível: usa liveCapacidade quando disponível (senão mantém capacidadeMaxima da prop)
  const capacidadeVisivel = Number.isFinite(Number(liveCapacidade ?? NaN)) ? (liveCapacidade as number) : capacidadeMaxima;

  return (
    <InformacoesEventoComponent>
      <Titulo hoverTitulo={hoverTitulo}>{titulo}</Titulo>

      <HorarioData>
        <span><CalendarTodayIcon className="icone" />{formatSafe(data)}</span>
        <span><AccessTimeIcon className="icone" />{horario}</span>
      </HorarioData>

      <span><LocationOnIcon className="icone" />{localizacao}</span>

      <span><PersonIcon className="icone" />{`${atual} / ${capacidadeVisivel} participantes`}</span>

      <BarraDeProgresso valor={percentual}/>

      <EntrarBt eventoId={eventoId} ownerId={ownerId} />
    </InformacoesEventoComponent>
  );
}
