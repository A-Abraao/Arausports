import styled from "styled-components";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TextField, InputAdornment } from "@mui/material";
import { CapacidadeEvento } from "./CapacidadeEvento";

//componentes dos detalhes do evento
export const DetalhesEventoContainer = styled.div`
  /* projeto desktop: mantenho comportamento atual */
  flex: 1 1 52%;
  max-width: 600px;
  width: clamp(360px, 45vw, 600px);
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.6vw, 1.75rem);
  padding: clamp(1rem, 2vw, 2.25rem);
  border-radius: 0.75em;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 clamp(0.25rem, 0.6vh, 0.625rem) clamp(1.75rem, 3vh, 2rem) rgba(2, 6, 23, 0.06),
    0 clamp(0.15rem, 0.4vh, 0.4rem) clamp(0.4rem, 0.8vh, 0.6rem) rgba(2, 6, 23, 0.04);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  align-items: center;
  min-height: calc(var(--vh, 1vh) * 75);

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 clamp(0.5rem, 1.8vh, 1.25rem) clamp(2rem, 3.8vh, 2.5rem) rgba(2, 6, 23, 0.08),
      0 clamp(0.25rem, 0.8vh, 0.6rem) clamp(0.6rem, 1vh, 0.75rem) rgba(2, 6, 23, 0.05);
    border-color: rgba(15, 23, 42, 0.08);
  }

  /* ajuste para telas médias */
  @media (max-width: 1100px) {
    width: clamp(320px, 60%, 520px);
    padding: clamp(0.85rem, 1.8vw, 1.5rem);
    gap: clamp(0.8rem, 1.2vw, 1.2rem);
  }

  /* telas pequenas: reduzir e ocupar 100% (empilhamento será controlado pelo pai) */
  @media (max-width: 900px) {
    flex: 0 0 100%;
    width: 92%;
    max-width: 720px;
    padding: clamp(0.7rem, 1.6vw, 1.1rem);
    gap: clamp(0.6rem, 1vw, 0.9rem);
    min-height: auto;
  }

  * { box-sizing: border-box; }
  & > * { min-width: 0; width: 100%; }

  span.header { width: 100%; display:flex; align-items:center; gap:clamp(0.5rem,1vw,0.75rem); }
  h2 { margin:0; font-size: clamp(1.1rem,1.4vw,1.35rem); font-weight:500; }
`;

//flex div
const FlexDiv = styled.div<{ direction?: string; gap?: string; alignItems?: string }>`
  display:flex;
  flex-direction: ${({ direction }) => direction || "column"};
  gap: ${({ gap }) => gap || "clamp(0.4rem, 0.6vw, 0.6rem)"};
  align-items: ${({ alignItems }) => alignItems || "stretch"};
  width:100%;
`;

//titulo que fica em cima dos inuts lá
const TituloInput = styled.input`
  font-family: var(--font-principal);
  background: rgba(245,245,220,0.5);
  border-radius: 0.35em;
  color: var(--muted-foreground);
  border: none;
  padding: clamp(0.6em,1.2vh,0.75em) clamp(0.8em,1.4vw,1em);
  width:100%;
  min-width:0;
  font-size: clamp(0.85rem,1vw,0.95rem);
  &::placeholder { font-family: var(--font-principal); }
  &:focus { outline: 2px solid var(--ring); outline-offset: 2px; }
`;

const DataInput = styled(TituloInput).attrs({ type: "date" })`
  padding: clamp(0.3em,0.6vh,0.4em);
  &::-webkit-calendar-picker-indicator { cursor:pointer; filter: invert(0.5); }
`;

//input de localização
const LocationInput = styled(TituloInput)``;

//div que encapsula os input para pegar eventos e horarios
const EventoHorario = styled.div`
  width:100%;
  border-top:1px solid #e5e7eb;
  margin-top: clamp(0.6rem,1vh,1em);
  padding-top: clamp(0.6rem,1vh,1em);
  display:flex; flex-direction:column; gap:clamp(1rem,2vw,1.25em);

  .quando-aonde {
    display:flex; gap:clamp(0.8rem,2vw,1.5em); align-items:flex-start; width:100%;
    & > * { min-width:0; flex:1 1 0; }
    @media (max-width: 600px) { flex-direction: column; }
  }

  .localizacao { width:100%; .titulo { width:100%; } }
`;

//wraper do titulo
const TituloWrapper = styled.div`
  display:flex; flex-direction:column; gap: clamp(0.4rem,0.6vw,0.5rem); width:100%;
  span.label { font-size:clamp(0.85rem,1vw,0.95rem); display:flex; align-items:center; gap:clamp(0.4rem,0.8vw,0.5rem); }
`;

//props para o componente de evento e data
export type EventoData = {
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
  imageUrl?: string;
  imagePath?: string;
};

type Props = {
  value: EventoData;
  onChange: (value: EventoData) => void;
};

//função que renderiza o componente DetalhesEvento
export function DetalhesEvento({ value, onChange }: Props) {
  const handleSet = (patch: Partial<EventoData>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <DetalhesEventoContainer>
      <span className="header">
        <PeopleIcon />
        <h2>Detalhes do evento</h2>
      </span>

      <FlexDiv>
        <TituloWrapper>
          <span className="label">Título do Evento *</span>
          <TituloInput
            placeholder="ex. jogo à tarde"
            value={value.titulo}
            onChange={(e) => handleSet({ titulo: e.target.value })}
          />
        </TituloWrapper>
      </FlexDiv>

      <FlexDiv>
        <TituloWrapper>
          <span className="label">Categoria do Esporte</span>
          <TituloInput
            placeholder="ex. vôlei"
            value={value.categoria}
            onChange={(e) => handleSet({ categoria: e.target.value })}
          />
        </TituloWrapper>
      </FlexDiv>

      <CapacidadeEvento
        value={value.capacidade}
        onChange={(cap) => handleSet({ capacidade: cap })}
      />

      <EventoHorario>
        <span className="header">
          <CalendarTodayIcon />
          <h2>Quando e Onde</h2>
        </span>

        <div className="quando-aonde">
          <div style={{ width: "100%" }}>
            <TituloWrapper>
              <span className="label">Data *</span>
              <DataInput
                value={value.data}
                onChange={(e) => handleSet({ data: e.target.value })}
              />
            </TituloWrapper>
          </div>

          <div style={{ width: "100%" }}>
            <TituloWrapper>
              <span className="label">Horário</span>
              <TextField
                type="time"
                value={value.horario}
                onChange={(e) => handleSet({ horario: e.target.value })}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5em",
                    background: "#ffffe0a6",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "transparent" },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--ring)",
                      borderWidth: "2px",
                    },
                    "& input": {
                      padding: "clamp(0.45rem, 0.8vh, 0.6rem) clamp(0.6rem, 1vw, 0.75rem)",
                    },
                  },
                }}
              />
            </TituloWrapper>
          </div>
        </div>

        <div className="localizacao">
          <TituloWrapper>
            <span className="label">
              <LocationPinIcon />
              Localização *
            </span>
            <LocationInput
              placeholder="ex. CSU"
              value={value.local}
              onChange={(e) => handleSet({ local: e.target.value })}
            />
          </TituloWrapper>
        </div>
      </EventoHorario>
    </DetalhesEventoContainer>
  );
}

