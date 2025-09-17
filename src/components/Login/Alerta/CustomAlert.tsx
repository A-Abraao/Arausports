import { Alert, Snackbar } from "@mui/material";
import type { AlertColor, SxProps, Theme } from "@mui/material";


type CustomAlertProps = {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
};

const typeStyles: Record<string, SxProps<Theme>> = {
  success: {
    backgroundColor: "#006400",
    color: "#ffffff",
    fontWeight: 500,
    "& .MuiAlert-message": { fontWeight: 500 },
    "& .MuiAlert-icon": { color: "#ffffff" },
  },
  error: {
    backgroundColor: "#DC143C",
    color: "#ffffff",
    fontWeight: 500,
    "& .MuiAlert-message": { fontWeight: 500 },
    "& .MuiAlert-icon": { color: "#ffffff" },
  },
  info: {},
  warning: {},
};

export default function CustomAlert({
  open,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: CustomAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={type as AlertColor}
        variant="standard"
        sx={{
          width: "100%",
          borderRadius: 2,
          boxShadow: 3,
          ...(typeStyles[type] || {}),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
