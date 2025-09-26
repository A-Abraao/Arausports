import { useState } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
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
}

export function EditarPerfilPopup({ open, onClose }: EditarPerfilPopupProps) {
  const { updateProfile } = useAuth();
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");

  const palavrasBio = bio.trim().split(/\s+/).filter(Boolean).length;
  const limiteAtingido = palavrasBio > 45;

  const handleSalvar = async () => {
    if (limiteAtingido) return;

    const dados: { username?: string; bio?: string } = {};
    if (nome.trim()) dados.username = nome.trim();
    if (bio.trim()) dados.bio = bio.trim();

    if (Object.keys(dados).length === 0) {
      alert("Preencha ao menos um campo para atualizar.");
      return;
    }

    try {
      await updateProfile(dados);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "0.5em",
          padding: "0.5em",
          border: "0.35em solid transparent",
          borderImageSlice: 1,
          borderImageSource: "var(--gradient-hero)",
          borderBottom: 0,
          borderRight: 0,
          borderLeft: 0,
        },
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
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              "& fieldset": {
                borderColor: "rgba(0,0,0,0.15)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0,0,0,0.25)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--ring)",
                borderWidth: "2px",
              },
              "& input": {
                padding: "10px 14px",
              },
            },
          }}
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
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              "& fieldset": {
                borderColor: "rgba(0,0,0,0.15)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0,0,0,0.25)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--ring)",
                borderWidth: "2px",
              },
              "& textarea": {
                padding: "10px 14px",
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            background: "transparent",
            textTransform: "none",
            borderColor: "var(--sidebar-ring)",
            color: "var(--sidebar-ring)",
          }}
        >
          Cancelar
        </Button>
        <Button
          sx={{
            background: "var(--accent)",
            color: "white",
            textTransform: "none",
          }}
          variant="contained"
          onClick={handleSalvar}
          disabled={limiteAtingido}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
