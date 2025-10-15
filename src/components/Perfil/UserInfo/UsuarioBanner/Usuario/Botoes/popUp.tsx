import { useState } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface EditarPerfilPopupProps {
  open: boolean;
  onClose: () => void;
}

export function EditarPerfilPopup({ open, onClose }: EditarPerfilPopupProps) {
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const { updateProfile } = useAuth();

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
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: "relative",
          borderRadius: "0.8em",
          padding: "0.25em",
          overflow: "hidden",
          width: "clamp(320px, 80vw, 500px)",
          maxWidth: "100%",
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "var(--gradient-hero)",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
            zIndex: 2,
          },
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.3)",
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.3rem", mt: 1 }}>Editar Perfil</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
          width: "100%",
        }}
      >
        <TextField
          label="Novo nome de usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            width: "clamp(250px, 90%, 100%)",
            alignSelf: "center",
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.35em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              minHeight: "50px",
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
                padding: "6px 10px",
                fontSize: "0.95rem",
              },
            },
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 10px) scale(1)",
            },
            "& .MuiInputLabel-shrink": {
              transform: "translate(14px, -6px) scale(0.75)",
            },
          }}
        />


        <TextField
          label="Nova bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          multiline
          rows={4}
          fullWidth
          error={limiteAtingido}
          helperText={`${palavrasBio}/45 palavras`}
          variant="outlined"
          sx={{
            width: "clamp(250px, 90%, 100%)",
            alignSelf: "center",
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
                padding: "6px 10px",
                fontSize: "0.95rem",
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            background: "crimson",
            textTransform: "none",
            padding: "0.35em",
            borderColor: "var(--sidebar-ring)",
            color: "white",
            "&:hover": {
              background: "#b22222",
            },
          }}
        >
          Esquece..
        </Button>
        <Button
          sx={{
            background: "var(--gradient-hero)",
            padding: "0.35em",
            color: "white",
            textTransform: "none",
            "&:hover": {
              opacity: 0.9,
            },
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
