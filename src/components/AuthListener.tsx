import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuth } from "../firebase";

export default function AuthListener() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuth((user) => {
      if (user) {
        // redireciona só se estiver na página de login (ou root)
        // impede que o site se sobrescreva quando o componente de login já foi carregado já
        if (location.pathname === "/") {
          navigate("/homepage");
        }
      }
      // NÃO forçar navigate("/") quando user for null — deixa rotas públicas livres
    });
    return unsubscribe;
  }, [navigate, location]);

  return null;
}
