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
import { Footer } from "../Footer";

//pagina de criar evento, basicamente ela vai encapsular tudo, permitindo alinhar os dois formulários corretamente
const CriarEventoPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
`

//componente que contém o formulario de criar evento
const CriarEventoComponent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: clamp(0.5rem, 1.5vh, 1rem);
  width: 90%;
  margin-bottom: 1.75em;
  min-height: calc(var(--vh, 1vh) * 100);
  box-sizing: border-box;

  /* wraper interno que força a responsividade */
  & > div {
    display: flex;
    gap: 1rem;
    width: 100%;
    padding: clamp(0.8rem, 2vw, 2rem);
    box-sizing: border-box;
    align-items: flex-start;
  }

  /* força o botão a ter largura limitada, altura responsiva e ficar centralizado */
  & .MuiButton-root {
    /* garante bloco para centrar com margin:auto */
    display: block !important;
    /* largura controlada: nunca maior que 15% do container, mas com min pra mobile */
    width: clamp(7.2rem, 12vw, 15%) !important;
    max-width: 15% !important;
    min-width: 7.2rem !important;

    /* altura responsiva */
    height: clamp(2.0rem, 3.6vh, 2.6rem) !important;
    line-height: normal !important;

    /* padding e tipografia (sobrescreve o sx inline do botao, típico do MUI) */
    padding: clamp(0.28rem, 0.7vh, 0.45rem) clamp(0.6rem, 1.2vw, 0.8rem) !important;
    font-size: clamp(0.85rem, 1.2vw, 0.95rem) !important;
    font-weight: 550 !important;
    text-transform: none !important;

    /* borda e aparência */
    border-radius: clamp(0.35rem, 0.6vw, 0.5rem) !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* centraliza o botão horizontalmente e mantém espaçamento superior */
    margin: clamp(0.6rem, 1.8vh, 1.15rem) auto 0 auto !important;

    box-sizing: border-box !important;
  }

  /* reduz o gap e ajusta o botão em telas médias */
  @media (max-width: 1100px) {
    width: 95%;
    & > div { gap: 0.75rem; }

    & .MuiButton-root {
      /* deixa o tamanho com tamanho em cascata, ou seja, se a tela aumentar tudo aumenta em sequência */
      width: clamp(7.6rem, 14vw, 14%) !important;
      min-width: 7.6rem !important;
      height: clamp(1.95rem, 3.4vh, 2.5rem) !important;
      padding: clamp(0.26rem, 0.65vh, 0.42rem) clamp(0.55rem, 1.0vw, 0.75rem) !important;
    }
  }

  /* telas pequenas: força empilhamento do wrapper e garante botão utilizável */
  @media (max-width: 900px) {
    width: 100%;
    padding-left: 0;
    padding-right: 0;

    & > div {
      display: flex !important;
      flex-direction: column !important;
      gap: clamp(0.6rem, 1.5vw, 1rem) !important;
      padding: clamp(0.6rem, 1.6vw, 1rem) !important;
      align-items: stretch !important;
    }

    & .MuiButton-root {
      /* mantém o botão centralizado, com min-width para tocar facilmente */
      width: clamp(7.2rem, 18vw, 15%) !important;
      min-width: 7.2rem !important;
      max-width: 15% !important;
      height: clamp(1.8rem, 3.2vh, 2.2rem) !important;
      padding: clamp(0.2rem, 0.6vh, 0.35rem) clamp(0.5rem, 1.0vw, 0.7rem) !important;
      margin: clamp(0.5rem, 1.4vh, 0.9rem) auto 0 auto !important;
    }
  }

  /* forçar centralização em telas mais peqeunas */
  @media (max-width: 420px) {
    & .MuiButton-root {
      width: clamp(7.2rem, 20vw, 18%) !important;
      min-width: 7.2rem !important;
      height: clamp(1.7rem, 3.0vh, 2.0rem) !important;
      font-size: clamp(0.78rem, 1.6vw, 0.9rem) !important;
    }
  }
`;
//aqui nós usamos o header que foi importado da homepage, não passamos estilos para ele até porque ele não precisa de nada
const Header = styled(HeaderComponent)``;

//renderizar o componente de criar evento
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

  //sate para guardar a imagem
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

      if (!evento.categoria) {
        throw new Error("sem categoria não dá")
        showAlert("tem sem a categoria (tipo do evento)", {
          severity: "error",
          duration: 3800,
          variant: "standard"
        })
      }

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

        <div style={{ display: "flex", gap: "1.5rem", width: "100%", padding: "clamp(0.8rem, 2vw, 2rem)" }}>
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
      <Footer/>
    </CriarEventoPage>
  );
}
