import { Button } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ButtonDeAcaoProps {
  children: ReactNode;
}

export function ButtonDeAcao({ children }: ButtonDeAcaoProps) {
  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate("/criar-evento")}
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
