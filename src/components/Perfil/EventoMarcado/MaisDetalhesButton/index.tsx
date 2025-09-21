import { Button } from "@mui/material";
import type { ReactNode } from "react";

interface ButtonDeAcaoProps {
  children: ReactNode;
}

export function ButtonDeAcao({ children }: ButtonDeAcaoProps) {
  return (
    <Button
      sx={{
        background: "var(--gradient-hero)",
        textTransform: "none",
        height: "",
        padding: "0.5em",
        color: "white",
      }}
    >
      {children}
    </Button>
  );
}
