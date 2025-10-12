import styled from "styled-components";
import { Usuario } from "./Usuario";
import { formatarDataDMA } from "../../../../../../firebase";
import { SalvarButton } from "../../../../../HomePage/Esportes/EsportesGrid/Card";
import { IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
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
  const [openPopup, setOpenPopup] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    try {
      setDeleting(true);
      await onDelete();
    } catch (err) {
      console.error("Erro ao deletar evento:", err);
    } finally {
      setDeleting(false);
      setOpenPopup(false);
    }
  };

  const handleCancel = () => {
    setOpenPopup(false);
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
    <>
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

      <Dialog
        open={openPopup}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            background: "var(--background)",
            color: "black",
            borderRadius: "1rem",
            minWidth: "clamp(250px, 35vw, 380px)",
            padding: "0.5rem 0.5rem",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
          Certeza que você quer apagar esse evento?
        </DialogTitle>

        <DialogContent>
        <DialogContentText
          sx={{
            opacity: 0.95,
            fontWeight: 600,
            display: "flex",
            flexDirection: "column",
            
          }}
        >
          <span style={{ fontWeight: 700 }}>
            Não vai ter como voltar atrás se tu fizer isso...
          </span>
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.25rem",
          padding: "0.5rem 1rem 1rem",
        }}
      >
        <Button
          onClick={handleCancel}
          sx={{
            border: "1px solid dodgerblue",
            textTransform: "none",
            fontSize: "0.85rem",
            padding: "4px 10px",
            minHeight: "32px",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          Deixa quieto..
        </Button>

        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          disabled={deleting}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            padding: "4px 10px",
            minHeight: "32px",
            "&:hover": { backgroundColor: "#b22222" },
          }}
        >
          {deleting ? <CircularProgress size={18} /> : "Apagar"}
        </Button>
      </DialogActions>
      </Dialog>
    </>
  );
}
