import styled from "styled-components";
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TextField, InputAdornment } from "@mui/material";

export const DetalhesEventoContainer = styled.div`
  width: 50%;
  max-width: 600px;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 2.25rem;
  border-radius: 0.75em; /* harmonizei com o CardEvento */
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
    font-size: 1.05rem;
    font-weight: 600;
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
  min-width: 0; /* importante em flex containers */
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

export function DetalhesEvento() {
  return (
    <DetalhesEventoContainer>
      <span className="header">
        <PeopleIcon />
        <h2>Detalhes do evento</h2>
      </span>

      <FlexDiv>
        <TituloWrapper>
          <span className="label">Titulo do Evento *</span>
          <TituloInput placeholder="ex. jogo a tarde" />
        </TituloWrapper>
      </FlexDiv>

      <FlexDiv>
        <TituloWrapper>
          <span className="label">Categoria do Esporte</span>
          <TituloInput placeholder="ex. vôlei" />
        </TituloWrapper>
      </FlexDiv>

      <EventoHorario>
        <span className="header">
          <CalendarTodayIcon />
          <h2>Quando e Onde</h2>
        </span>

        <div className="quando-aonde">
          <div style={{ width: "100%" }}>
            <TituloWrapper>
              <span className="label">Data *</span>
              <DataInput />
            </TituloWrapper>
          </div>

          <div style={{ width: "100%" }}>
            <TituloWrapper>
              <span className="label">Horário</span>
              <TextField
                type="time"
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
            <span className="label"><LocationPinIcon />Localização *</span>
            <LocationInput placeholder="ex. CSU" />
          </TituloWrapper>
        </div>
      </EventoHorario>
    </DetalhesEventoContainer>
  );
}
