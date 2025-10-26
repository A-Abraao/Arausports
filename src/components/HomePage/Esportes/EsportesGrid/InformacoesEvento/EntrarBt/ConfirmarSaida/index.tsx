import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmarSaidaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
  // Texto customizável 
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}
export function ConfirmarSaida({ open, onClose, onConfirm, loading = false, title, description, confirmLabel, cancelLabel,}: ConfirmarSaidaProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) onClose();
        }}
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
                background: "var(--gradient-hero)", //ele imita o popup de editar perfil
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
                zIndex: 2,
            },
            },
        }}
        BackdropProps={{
            sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.32)",
            },
        }}
        // evita fechar com ESC quando estiver em loading, util para não quebrar o site
        disableEscapeKeyDown={loading}
        >
        <DialogTitle sx={{ fontSize: "1.25rem", mt: 1 }}>{title}</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 0.5 }}>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
            {description}
            </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
            <Button
            onClick={() => {
                //aqui ele vericiar se ta carregando, se tiver ele não vai fechar, mas se tiver.... aí o popup fecha irmão...
                if (!loading) onClose();
            }}
            variant="outlined"
            sx={{
                background: "var(--gradient-hero)",
                textTransform: "none",
                padding: "0.45em 0.8em",
                color: "white",
                border: 'none',
                outline: "none",
                "&:hover": {
                background: "rgba()",
                },
            }}
            disabled={loading}
            >
            {cancelLabel}
            </Button>

            <Button
            onClick={() => {
                if (!loading) onConfirm();
            }}
            sx={{
                background: "crimson",
                padding: "0.45em 0.8em",
                color: "white",
                textTransform: "none",
                "&:hover": {
                background: "#b22222",
                },
            }}
            variant="contained"
            disabled={loading}
            >
            {loading ? "Caindo fora.." : confirmLabel}
            </Button>
        </DialogActions>
        </Dialog>
  );
}

