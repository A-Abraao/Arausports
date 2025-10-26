import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from "@mui/material";
import { useSignOut } from "../../../../../../supabase";

interface ConfirmLogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ConfirmLogoutDialog({ open, onClose }: ConfirmLogoutDialogProps) {
  const { signOut, loading } = useSignOut();

  const handleConfirm = async () => {
    try {
      await signOut({ redirectTo: "/" });
      // onClose provavelmente não será necessário porque signOut redireciona,
      // mas chamamos para garantir que o diálogo feche caso a navegação não ocorra
      onClose();
    } catch (err) {
      console.error("Erro no signOut:", err);
      // pode mostrar um alert ou snackbar aqui
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { if (!loading) onClose(); }}
      PaperProps={{
        sx: {
          borderRadius: "0.8rem",
          width: "clamp(300px, 70vw, 420px)",
          padding: "0.25rem",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.35)"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Confirmar saída</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.primary" }}>
          Certeza que quer sair da conta
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            textTransform: "none",
            color: "white",
            background: "dodgerblue",
            "&:hover": { background: "rgba(30, 144, 230, 0.9)" }
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Sair da conta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmLogoutDialog;
