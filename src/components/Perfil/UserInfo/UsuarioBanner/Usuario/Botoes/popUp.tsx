import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface EditarPerfilPopupProps {
  open: boolean;
  onClose: () => void;
  onSalvar: (dados: { nome: string; bio: string }) => void;
}

export function EditarPerfilPopup({ open, onClose, onSalvar }: EditarPerfilPopupProps) {
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");

  
  const palavrasBio = bio.trim().split(/\s+/).filter(Boolean).length;
  const limiteAtingido = palavrasBio > 45;

  const handleSalvar = () => {
    if (!limiteAtingido) {
      onSalvar({ nome, bio });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "1em", padding: "1em" },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.3)",
        },
      }}
    >
      <DialogTitle>Editar Perfil</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Novo nome de usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
        />

        <TextField
          label="Nova bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          multiline
          rows={3}
          fullWidth
          error={limiteAtingido}
          helperText={`${palavrasBio}/45 palavras`}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSalvar}
          disabled={limiteAtingido || !nome.trim()}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
