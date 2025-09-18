import styled from "styled-components";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../Login/Alerta/AlertProvider";
import Header from "./Header";

const HomePageComponent = styled.div`

  width: 100%;
  height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    // verifica se veio do login (state passado na navegação)
    const state = location.state as any;
    if (state?.fromLogin) {
      // dispara alerta imediatamente
      showAlert("Bem-vindo! Login efetuado com sucesso.", {
        severity: "success",
        duration: 2800,
        variant: "standard",
      });

      // limpa o state do histórico para não repetir alerta
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, showAlert]);

  return (
    <HomePageComponent>
      <Header/>
    
    </HomePageComponent>
  );
}
