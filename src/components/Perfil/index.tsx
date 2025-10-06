import styled from "styled-components";
import { Header } from "./Header";
import { UserInfo } from "./UserInfo";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAlert } from "../Alerta/AlertProvider";
import { useNavigate } from "react-router-dom";

const PerfilComponent = styled.div`
    display: flex;
    color: white;
    flex-direction: column;
    width: 100%;
`

export function Perfil() {
    const location = useLocation()
    const { showAlert } = useAlert()
    const navigate = useNavigate()

    useEffect(() => {
    const state = location.state as any;
    if (state?.from == "criar-evento") {
      showAlert("Evento criado mano", {
        severity: "success",
        duration: 2800,
        variant: "standard",
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, showAlert]);

    return (
        <PerfilComponent>
            <Header/>
            <UserInfo/>
        </PerfilComponent>
    )
}