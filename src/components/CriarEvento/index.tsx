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
import { useAuth } from "../../contexts/AuthContext";
import { useAddEvent } from "../../firebase/eventos/criarEvento";
import { useSupabaseUpload } from "../../firebase/servicos/useSupabaseUpload";

const CriarEventoComponent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: clamp(0.5rem, 1.5vh, 1rem);
  min-height: calc(var(--vh, 1vh) * 100);
`;

const Header = styled(HeaderComponent)``;

const InformacoesEvento = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: clamp(0.8rem, 2vw, 2rem);
  width: 100%;
  padding: clamp(0.8rem, 2vw, 2rem);

  @media (max-width: 900px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

export function CriarEvento() {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const { showAlert } = useAlert();

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addEventForUser, loading } = useAddEvent();

  const { upload, uploading: uploadingImage, error: uploadError } = useSupabaseUpload();

  const handleSubmit = async () => {
    if (!firebaseUser) {
      showAlert("Faça login primeiro zé", {
        severity: "error",
        duration: 3800,
        variant: "standard"
      });
      return;
    }

    try {
      const payload: Partial<EventoData> = {
        ...evento,
        imageUrl: "",
        imagePath: ""
      };

      const id = await addEventForUser(firebaseUser.uid, payload as EventoData);

      if (!id) {
        showAlert("Id do evento deve estar faltando..", {
          severity: "error",
          duration: 3800,
          variant: "standard"
        });
        return;
      }

      if (imageFile) {
        try {
          await upload(imageFile, firebaseUser.uid, id, { asCover: true });
          
        } catch (uploadErr) {
          console.error("Erro no upload da imagem:", uploadErr);

          
          showAlert("Evento criado, mas houve erro ao enviar a imagem. Você pode enviar depois na página do evento.", {
            severity: "warning",
            duration: 6000,
            variant: "standard"
          });

        }
      }

      navigate("/perfil", {
        state: { from: "criar-evento" },
      });
    } catch (err) {
      console.error("Que cagada!!", err);
      showAlert("Erro ao criar evento — verifique o console.", {
        severity: "error",
        duration: 2800,
        variant: "standard"
      });
    }
  };

  return (
    <div>
      <Header>
        <IconButton onClick={() => navigate("/perfil")}>
          <VoltarSetinha width={"clamp(1.5rem, 1.8vw, 2rem)"} height={"clamp(1.5rem, 1.8vw, 2rem)"} />
        </IconButton>
        <h1 style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}>Criar Evento</h1>
      </Header>

      <CriarEventoComponent>
        <Titulo />

        <InformacoesEvento>
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
        </InformacoesEvento>

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
    </div>
  );
}
