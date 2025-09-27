import styled from "styled-components";
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { CapacidadeEvento } from "./CapacidadeEvento";
import { useState } from "react";
import ImageUpload from "../ImageUpload";

export const DetalhesEventoContainer = styled.div`
  width: 45%;
  max-width: 600px;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 2.25rem;
  border-radius: 0.75em;
  background: rgba(255,255,255,0.9);

  
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow:
    0 10px 30px rgba(2,6,23,0.06),
    0 2px 6px rgba(2,6,23,0.04);

 
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 18px 40px rgba(2,6,23,0.08),
      0 4px 12px rgba(2,6,23,0.05);
    border-color: rgba(15,23,42,0.08);
  }

  
  align-items: center;

  
  @media (max-width: 900px) {
    width: 100%;
    padding: 1rem;
  }

  
  * {
    box-sizing: border-box;
  }

  
  & > * {
    min-width: 0;
    width: 100%;
  }

  span.header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  h2 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 500;
  }
`;


const FlexDiv = styled.div<{ direction?: string; gap?: string; alignItems?: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "column"};
  gap: ${({ gap }) => gap || "0.5em"};
  align-items: ${({ alignItems }) => alignItems || "stretch"};
  width: 100%;
`;

const TituloInput = styled.input`
  font-family: var(--font-principal);
  background: rgba(245, 245, 220, 0.5);
  border-radius: 0.35em;
  color: var(--muted-foreground);
  border: none;
  padding: 0.75em 1em;
  width: 100%;
  min-width: 0; 
  font-size: 0.95rem;

  &::placeholder {
    font-family: var(--font-principal);
  }

  &:focus {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
`;


const DataInput = styled(TituloInput).attrs({ type: "date" })`
  padding: 0.4em;
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.5);
  }
`;


const LocationInput = styled(TituloInput)``;


const EventoHorario = styled.div`
  width: 100%;
  border-top: 1px solid #e5e7eb;
  margin-top: 1em;
  padding-top: 1em;
  display: flex;
  gap: 1.25em;
  flex-direction: column;

  .quando-aonde {
    display: flex;
    gap: 1.5em;
    align-items: flex-start;
    width: 100%;

    /* permite que os filhos encolham corretamente em flex */
    & > * {
      min-width: 0;
      flex: 1 1 0;
    }

    /* responsivo: empilha em telas pequenas */
    @media (max-width: 600px) {
      flex-direction: column;
    }
  }

  .localizacao {
    width: 100%;

    .titulo {
      width: 100%;
    }
  }
`;

const TituloWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  span.label {
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

type EventoData = {
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  capacidade: number;
};

type Props = {
  value: EventoData;
  onChange: (value: EventoData) => void;
};

export function DetalhesEvento({ value, onChange }: Props) {
  const [form, setForm] = useState<EventoData>(value);

  useEffect(() => {
    onChange(form);
  }, [form]);

  return (
    <DetalhesEventoContainer>
      <span className="header">
        <PeopleIcon />
        <h2>Detalhes do evento</h2>
      </span>

      <FlexDiv>
        <TituloWrapper>
          <span className="label">Titulo do Evento *</span>
          <TituloInput
            placeholder="ex. jogo a tarde"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </TituloWrapper>
      </FlexDiv>

      <FlexDiv>
        <TituloWrapper>
          <span className="label">Categoria do Esporte</span>
          <TituloInput
            placeholder="ex. vôlei"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          />
        </TituloWrapper>
      </FlexDiv>

      <CapacidadeEvento
        value={form.capacidade}
        onChange={(cap) => setForm({ ...form, capacidade: cap })}
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
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </TituloWrapper>
          </div>

          <div style={{ width: "100%" }}>
            <TituloWrapper>
              <span className="label">Horário</span>
              <TextField
                type="time"
                value={form.horario}
                onChange={(e) => setForm({ ...form, horario: e.target.value })}
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
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--ring)",
                      borderWidth: "2px",
                    },
                    "& input": {
                      padding: "8px 12px",
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
              <LocationPinIcon />Localização *
            </span>
            <LocationInput
              placeholder="ex. CSU"
              value={form.local}
              onChange={(e) => setForm({ ...form, local: e.target.value })}
            />
          </TituloWrapper>
        </div>
      </EventoHorario>
    </DetalhesEventoContainer>
  );
}