import { Button } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ButtonDeAcaoProps {
  children: ReactNode;
}

export function ButtonDeAcao({ children }: ButtonDeAcaoProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/criar-evento")}
      sx={{
        background: "var(--gradient-hero)",
        textTransform: "none",
        color: "white",
        padding: {
          xs: "0.4rem 0.75rem",
          sm: "0.5rem 1rem",
        },

        minWidth: { xs: "100%", sm: "9rem" },
        
      }}
      variant="contained"
    >
      {children}
    </Button>
  );
}
