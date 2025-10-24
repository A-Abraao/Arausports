import styled from "styled-components";
import { HeaderComponent } from "../Perfil/Header";
import VoltarSetinha from '../../assets/img/retornar-setinha.svg?react';
import { IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Alerta/AlertProvider";
import { useState } from "react";
import { Titulo } from "./Titulo";
import { DetalhesEvento } from "./DetalhesEvento";
import { PreviaEvento } from "./PreviaEvento";
import type { EventoData } from "./DetalhesEvento";
import { useAuth } from "../../supabase";
import { useAddEvent } from "../../supabase";

const CriarEventoPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
`

const CriarEventoComponent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: clamp(0.5rem, 1.5vh, 1rem);
  width: 90%;
  min-height: calc(var(--vh, 1vh) * 100);
`;

const Header = styled(HeaderComponent)``;

export function CriarEvento() {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const userId = user?.id ?? null;
  const { showAlert } = useAlert();

  const [evento, setEvento] = useState<EventoData>({
    titulo: "",
    categoria: "",
    data: "",
    horario: "",
    local: "",
    capacidade: 1,
    imageUrl: "",
    imagePath: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  //chama o hook de criar o evento..
  const { addEventForUser, loading } = useAddEvent();

  //o hook lida com o upload mas aqui usamos o loading para fazer o button esperar quando tudo der certo
  const uploadingImage = loading;

  const handleSubmit = async () => {
    if (!userId) {
      showAlert("Faça login primeiro zé", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      });
      return;
    }

    try {
      const payload = {
        titulo: evento.titulo,
        categoria: evento.categoria,
        data: evento.data,
        horario: evento.horario,
        local: evento.local,
        capacidade: evento.capacidade,
      };

      const id = await addEventForUser(userId, payload, imageFile);

      if (!id) {
        showAlert("Id do evento deve estar faltando..", {
          severity: "error",
          duration: 3800,
          variant: "standard"
        });
        return;
      }

      navigate("/perfil", {
        state: { from: "criar-evento" },
      });
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      showAlert("Erro ao criar evento..", {
        severity: "error",
        duration: 2800,
        variant: "standard"
      });
    }
  };

  return (
    <CriarEventoPage>
      <Header>
        <IconButton onClick={() => navigate("/perfil")}>
          <VoltarSetinha width={"clamp(2.2rem, 2.5vw, 2.7rem)"} height={"clamp(2.2rem, 2.5vw, 2.7rem)"} />
        </IconButton>
        <h1 style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}>Criar Evento</h1>
      </Header>

      <CriarEventoComponent>
        <Titulo />

        <div style={{ display: "flex", gap: "1rem", width: "100%", padding: "clamp(0.8rem, 2vw, 2rem)" }}>
          <DetalhesEvento value={evento} onChange={setEvento} />

          <PreviaEvento
            onImageSelect={(file: File | null) => {
              setImageFile(file);
              if (file) {
                setEvento(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
              } else {
                setEvento(prev => ({ ...prev, imageUrl: "" }));
              }
            }}
            existingImageUrl={evento.imageUrl}
          />
        </div>

        <Button
          sx={{
            width: { xs: "100%", sm: "46%", md: "30%", lg: "22%" },
            textTransform: "none",
            background: "var(--gradient-hero)",
            color: "white",
            padding: { xs: "clamp(0.4rem, 1.2vh, 0.6rem)", sm: "clamp(0.5rem, 1.5vh, 0.75rem)" },
            fontWeight: 550,
            fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
            marginTop: "clamp(0.6rem, 1.8vh, 1.15rem)",
            borderRadius: "clamp(0.35rem, 0.6vw, 0.5rem)",
          }}
          onClick={handleSubmit}
          disabled={loading || uploadingImage}
          variant="contained"
        >
          {loading || uploadingImage ? (uploadingImage ? "Enviando imagem..." : "Criando...") : "Criar Evento"}
        </Button>

      </CriarEventoComponent>
    </CriarEventoPage>
  );
}
