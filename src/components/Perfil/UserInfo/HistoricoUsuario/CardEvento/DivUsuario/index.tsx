import styled from "styled-components";
import { Usuario } from "./Usuario"; 
import { formatarDataDMA } from "../../../../../../firebase";
import { SalvarButton } from "../../../../../HomePage/Esportes/EsportesGrid/Card";
import { IconButton, CircularProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";

const DivUsuarioComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.35rem, 0.8vw, 0.6rem);
`;

const TipoDoEsporte = styled.span`
  color: white;
  background: var(--secondary);
  border-radius: 9999px;
  padding: clamp(0.25rem, 0.6vw, 0.45rem) clamp(0.55rem, 1.4vw, 0.95rem);
  font-size: clamp(0.65rem, 1.2vw, 0.75rem);
  font-weight: 450;
  transition: background-color 0.4s ease-in-out;

  &:hover {
    background: var(--ring);
  }
`;

const DeleteButton = styled(IconButton)`
  color: crimson;
  background: transparent;
  transition: background-color 0.25s ease, transform 0.15s ease;
  padding: clamp(0.25rem, 0.5vw, 0.35rem);

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
    transform: scale(1.08);
  }

  svg {
    font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  }
`;


type DivUsuarioProps = {
  data: string;
  esporte: string;
  foiSalvo?: boolean;
  loading: boolean;
  onToggleSave?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

export function DivUsuario({
  data,
  esporte,
  loading,
  foiSalvo = false,
  onToggleSave,
  onDelete,
}: DivUsuarioProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;

    const ok = window.confirm("Tem certeza que deseja apagar esse evento? Essa ação é irreversível.");
    if (!ok) return;

    try {
      setDeleting(true);
      await onDelete();
    } catch (err) {
      console.error("Erro ao deletar evento:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      try {
        await onToggleSave();
      } catch (err) {
        console.error("Erro no toggle save:", err);
      }
    }
  };

  return (
    <DivUsuarioComponent>
      <Usuario data={formatarDataDMA(data)} foiSalvo={foiSalvo} />
      <RightGroup>
        {foiSalvo && onToggleSave && (
          <SalvarButton ativo={!!foiSalvo} onClick={handleSaveClick} loading={loading} />
        )}


        {onDelete && (
          <DeleteButton
            aria-label="deletar evento"
            onClick={handleDeleteClick}
            size="small"
            title="Apagar evento"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {deleting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              <DeleteOutlineIcon />
            )}
          </DeleteButton>
        )}

        <TipoDoEsporte>{esporte}</TipoDoEsporte>
      </RightGroup>
    </DivUsuarioComponent>
  );
}
