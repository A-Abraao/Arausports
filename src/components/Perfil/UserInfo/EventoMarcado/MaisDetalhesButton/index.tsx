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
      size="small"
      sx={{
        background: "var(--gradient-hero)",
        textTransform: "none",
        color: "white",
        // Mobile (xs) reduzido, Desktop (sm) original
        padding: { 
          xs: "0.1rem 0.4rem", // Tamanho reduzido
          sm: "0.5rem 1rem", // Tamanho desktop original
        },
        // Mobile (xs) reduzido, Desktop (sm) original
        fontSize: {
          xs: "0.65rem", // Tamanho reduzido
          sm: "0.875rem", // Tamanho desktop original
        },
        // CORREÇÃO CHAVE: Remove 100% de largura no mobile, usa tamanho controlado
        minWidth: { xs: "5rem", sm: "9rem" }, 
      }}
      variant="contained"
    >
      {children}
    </Button>
  );
}