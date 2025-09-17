// src/components/Login/Alerta/AlertProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor, SxProps, Theme } from "@mui/material";

type AlertOptions = {
  severity?: AlertColor;
  duration?: number;
  variant?: "filled" | "outlined" | "standard";
  center?: boolean; // se true centraliza absoluto
  sx?: SxProps<Theme>; // estilos custom aplicados ao <Alert>
};

type AlertContextType = {
  /**
   * Compatível com:
   *  showAlert("mensagem") // info por padrão
   *  showAlert("mensagem", "error", 4000)
   *  showAlert("mensagem", { severity: "error", duration: 4000, sx: { ... }})
   */
  showAlert: (
    message: string,
    severityOrOpts?: AlertColor | AlertOptions,
    durationMaybe?: number
  ) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [duration, setDuration] = useState<number | null>(4000);
  const [variant, setVariant] = useState<"filled" | "outlined" | "standard">("standard");
  const [center, setCenter] = useState<boolean>(false);
  const [customSx, setCustomSx] = useState<SxProps<Theme> | undefined>(undefined);

  const showAlert = (
    msg: string,
    severityOrOpts?: AlertColor | AlertOptions,
    durationMaybe?: number
  ) => {
    // reset previous custom styles
    setCustomSx(undefined);
    setCenter(false);

    // caso o segundo argumento seja um objeto de opções
    if (typeof severityOrOpts === "object" && severityOrOpts !== null) {
      const opts = severityOrOpts as AlertOptions;
      setMessage(msg);
      setSeverity(opts.severity ?? "info");
      setDuration(opts.duration ?? 4000);
      setVariant(opts.variant ?? "standard");
      setCustomSx(opts.sx);
      setCenter(Boolean(opts.center));
      setOpen(true);
      return;
    }

    // caso tenha usado a assinatura antiga: (msg, severity?, duration?)
    const sev = (severityOrOpts as AlertColor) ?? "info";
    const dur = typeof durationMaybe === "number" ? durationMaybe : 4000;
    setMessage(msg);
    setSeverity(sev);
    setDuration(dur);
    setVariant("standard");
    setOpen(true);
  };

  const handleClose = (_: any, reason?: string) => {
    // evita fechar por clickaway se quiser, mas aqui apenas fecha normal
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // base sx do Alert (você pode ajustar)
  const baseAlertSx: SxProps<Theme> = {
    width: "100%",
    borderRadius: 2,
    boxShadow: 3,
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={duration ?? undefined}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{
          sx: {
            position: "fixed",
            top: center ? "50%" : "8%",
            left: "50%",
            transform: center ? "translate(-50%, -50%)" : "translateX(-50%)",
            width: "min(520px, 90%)",
            zIndex: 1400,
          },
        }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant={variant}
          sx={{
            ...baseAlertSx,
            // mescla com o customSx (se houver)
            ...(customSx as object),
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
