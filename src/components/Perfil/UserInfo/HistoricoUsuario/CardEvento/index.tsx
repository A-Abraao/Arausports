import styled from "styled-components";
import { DivUsuario } from "./DivUsuario";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { CardImagem } from "./CardImagem";

const CardEventoComponent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.65em;
  color: black;
  padding: 1.5em;
  border-radius: 0.5em;
  gap: 0.65em;
  overflow: visible;
  overflow-wrap: break-word;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  will-change: transform;
  transform-origin: center;
  user-select: none;
  width: 100%;
  height: 100vh;
`;

const TituloEvento = styled.h3`
  font-size: 1.1em;
  font-weight: 400;
`;

const InformacoesEvento = styled.div`
  color: var(--muted-foreground);
  display: flex;
  gap: 1em;

  span {
    display: flex;
    align-items: center;
    gap: 0.25em;
    font-size: 0.9em;
    font-weight: 400;
  }
`;

const DivInferior = styled.div`
  padding: 0.5em;
  text-align: center;
  margin-top: 1px solid var(--muted-foreground);
`;

type CardEventoProps = {
  titulo: string;
  local: string;
  data: string;
  esporte: string;
  capacidade: string;
  loadingSalvo: boolean
  foiSalvo?: boolean;
  savedFrom?: "eventosSalvos" | "meusEventos" | string;
  onUnsave?: () => Promise<void> | void;
};

export function CardEvento({
  titulo,
  local,
  data,
  esporte,
  loadingSalvo,
  capacidade,
  foiSalvo = false,
  onUnsave,
}: CardEventoProps) {
  return (
    <CardEventoComponent>
      <DivUsuario data={data} esporte={esporte} foiSalvo={!!foiSalvo} onToggleSave={onUnsave} loading={loadingSalvo}/>

      <TituloEvento>{titulo}</TituloEvento>

      <InformacoesEvento>
        <span>
          <LocationOnIcon sx={{ fontSize: "1.25em" }} />
          {local}
        </span>
        <span>
          <PersonIcon sx={{ fontSize: "1.25em" }} />
          {`${capacidade} pessoas`}
        </span>
      </InformacoesEvento>

      <CardImagem />

      <DivInferior>
        
      </DivInferior>
    </CardEventoComponent>
  );
}
