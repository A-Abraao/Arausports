import styled from "styled-components";
import { HeaderComponent } from "../Perfil/Header";
import VoltarSetinha from '../../assets/img/retornar-setinha.svg?react';
import { IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Titulo } from "./Titulo";
import { DetalhesEvento } from "./DetalhesEvento";
import { PreviaEvento } from "./PreviaEvento";
import type { EventoData } from "./DetalhesEvento";
import { useAuth } from "../../contexts/AuthContext";
import { addEventForUser } from "../../criarEvento";

const CriarEventoComponent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.75em;
`;

const Header = styled(HeaderComponent)``;

const InformacoesEvento = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 2em;
  width: 100%;
  gap: 2em;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export function CriarEvento() {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  const [evento, setEvento] = useState<EventoData>({
    titulo: "",
    categoria: "",
    data: "",
    horario: "",
    local: "",
    capacidade: 0,
    imageUrl: "",
    imagePath: "",
  });

  const handleSubmit = async () => {
    if (!firebaseUser) {
      alert("Você precisa estar logado para criar um evento.");
      return;
    }

    try {
      const payload: Partial<EventoData> = { ...evento };
      delete (payload as any).imageUrl;
      delete (payload as any).imagePath;

      const eventId = await addEventForUser(firebaseUser.uid, payload as EventoData);
      console.log("Evento criado com ID:", eventId);
      navigate("/perfil");
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      alert("Erro ao criar evento. Veja o console.");
    }
  };

  return (
    <div>
      <Header>
        <IconButton onClick={() => navigate("/perfil")}>
          <VoltarSetinha width={"1.75em"} height={"1.75em"} />
        </IconButton>
        <h1>Criar Evento</h1>
      </Header>

      <CriarEventoComponent>
        <Titulo />

        <InformacoesEvento>
          <DetalhesEvento value={evento} onChange={setEvento} />
          <PreviaEvento />
        </InformacoesEvento>

        <Button
          sx={{
            width: "22%",
            textTransform: "none",
            background: "var(--gradient-hero)",
            color: "white",
            padding: "0.25em 0.25em",
            fontWeight: "550",
            fontSize: "1em",
            marginTop: "1.15em",
          }}
          onClick={handleSubmit}
        >
          Criar Evento
        </Button>
      </CriarEventoComponent>
    </div>
  );
}
