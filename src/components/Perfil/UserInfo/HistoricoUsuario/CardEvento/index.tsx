import styled from "styled-components";
import { DivUsuario } from "./DivUsuario";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { CardImagem } from "./CardImagem";

const CardEventoComponent = styled.div`
  display: flex;
  flex-direction: column;
  padding: clamp(0.9rem, 2.2vw, 1.5rem);
  color: black;
  border-radius: 0.5rem;
  gap: clamp(0.45rem, 1.0vw, 0.65rem);
  overflow: visible;
  overflow-wrap: break-word;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  user-select: none;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
`;

const TituloEvento = styled.h3`
  font-size: clamp(1rem, 2.2vw, 1.1rem);
  font-weight: 400;
  margin: 0;
`;

const InformacoesEvento = styled.div`
  color: var(--muted-foreground);
  display: flex;
  gap: clamp(0.6rem, 1.2vw, 1rem);

  span {
    display: flex;
    align-items: center;
    gap: clamp(0.25rem, 0.6vw, 0.25rem);
    font-size: clamp(0.85rem, 1.6vw, 0.9rem);
    font-weight: 400;
  }
`;

const DivInferior = styled.div`
  padding: clamp(0.35rem, 0.7vw, 0.5rem);
  text-align: center;
  margin-top: 1px solid var(--muted-foreground);
`;

type CardEventoProps = {
  titulo: string;
  local: string;
  data: string;
  esporte: string;
  capacidade: string;
  loadingSalvo: boolean;
  foiSalvo?: boolean;
  savedFrom?: "eventosSalvos" | "meusEventos" | string;
  onUnsave?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
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
  onDelete,
}: CardEventoProps) {
  return (
    <CardEventoComponent>
      <DivUsuario
        data={data}
        esporte={esporte}
        foiSalvo={!!foiSalvo}
        onToggleSave={onUnsave}
        loading={loadingSalvo}
        onDelete={onDelete}
      />

      <TituloEvento>{titulo}</TituloEvento>

      <InformacoesEvento>
        <span>
          <LocationOnIcon sx={{ fontSize: "1.25rem" }} />
          {local}
        </span>
        <span>
          <PersonIcon sx={{ fontSize: "1.25rem" }} />
          {`${capacidade} pessoas`}
        </span>
      </InformacoesEvento>

      <CardImagem />
      <DivInferior />
    </CardEventoComponent>
  );
}
