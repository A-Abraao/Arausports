import React, { createContext, useContext, useState } from "react";
import CustomAlert from "./CustomAlert";
import type { AlertColor, SxProps, Theme } from "@mui/material";

type AlertOptions = {
  severity?: AlertColor;
  duration?: number;
  center?: boolean;
  variant?: "filled" | "outlined" | "standard"; 
  sx?: SxProps<Theme>; 
};

type AlertContextType = {
  showAlert: (message: string, severityOrOpts?: AlertColor | AlertOptions, durationMaybe?: number) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("userAlert precisa do AuthProvider");
  return ctx;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<AlertColor>("info");
  const [duration, setDuration] = useState<number>(3000);

  const showAlert = (
    msg: string,
    severityOrOpts?: AlertColor | AlertOptions,
    durationMaybe?: number
  ) => {
    if (typeof severityOrOpts === "object" && severityOrOpts !== null) {
      setMessage(msg);
      setType(severityOrOpts.severity ?? "info");
      setDuration(severityOrOpts.duration ?? 3000);
      setOpen(true);
      return;
    }

    const sev = (severityOrOpts as AlertColor) ?? "info";
    const dur = durationMaybe ?? 3000;
    setMessage(msg);
    setType(sev);
    setDuration(dur);
    setOpen(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <CustomAlert
        open={open}
        message={message}
        type={type}
        duration={duration}
        onClose={() => setOpen(false)}
      />
    </AlertContext.Provider>
  );
};
