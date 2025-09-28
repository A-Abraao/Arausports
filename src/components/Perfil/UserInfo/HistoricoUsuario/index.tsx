import styled from "styled-components";
import { FiltroHistorico } from "./FiltroHistorico";
import { CardEvento } from "./CardEvento";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { removeSavedEventForUser } from "../../../../servicos/eventosSalvos";
import { db, auth } from "../../../../firebase"; 

const HistoricoUsuarioComponent = styled.section`
  width: 100%;
  display: flex;
  min-height: 50vh;
  flex-direction: column;
  gap: 0.9em;
  margin-top: 2em;
`;

type EventoResumo = {
  id: string;
  titulo: string;
  local: string;
  data: string; 
  esporte: string;
  capacidade: string;
};

export function HistoricoUsuario() {
  const [eventos, setEventos] = useState<EventoResumo[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<
    "meusEventos" | "eventosSalvos"
  >("meusEventos");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        setEventos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      if (!uid) {
        setEventos([]);
        return;
      }

      setLoading(true);
      try {
        if (opcaoSelecionada === "meusEventos") {
          const eventosRef = collection(db, "users", uid, "eventos");
          const snap = await getDocs(eventosRef);

          const lista = snap.docs.map((doc) => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              titulo: data.titulo ?? "—",
              local: data.local ?? "—",
              data: data.data ?? "",
              esporte: data.categoria ?? "—",
              capacidade: String(data.capacidade ?? "0"),
            } as EventoResumo;
          });

          setEventos(lista);
        } else if (opcaoSelecionada === "eventosSalvos") {
          const salvosRef = collection(db, "users", uid, "eventosSalvos");
          const snap = await getDocs(salvosRef);

          const lista = snap.docs.map((doc) => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              titulo: data.titulo ?? "—",
              local: data.local ?? "—",
              data: data.data ?? "",
              esporte: data.categoria ?? "—",
              capacidade: String(data.capacidade ?? "0"),
            } as EventoResumo;
          });

          setEventos(lista);
        } else if (opcaoSelecionada === "proximosEventos") {
          const eventosRef = collection(db, "users", uid, "eventos");
          const snap = await getDocs(eventosRef);
          const hoje = new Date();
          const listaTodos = snap.docs.map((doc) => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              titulo: data.titulo ?? "—",
              local: data.local ?? "—",
              data: data.data ?? "",
              esporte: data.categoria ?? "—",
              capacidade: String(data.capacidade ?? "0"),
            } as EventoResumo;
          });

          const proximos = listaTodos.filter((e) => {
            if (!e.data) return false;
            const parts = e.data.split("-");
            if (parts.length !== 3) return false;
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            return d >= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
          });

          setEventos(proximos);
        }
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [uid, opcaoSelecionada]);

  return (
    <HistoricoUsuarioComponent>
      <FiltroHistorico
        selecionado={opcaoSelecionada}
        onSelect={(op) => setOpcaoSelecionada(op)}
      />

      {loading && <p>Peraí, peraí...</p>}

      {!loading && eventos.length === 0 && (
        <p style={{ textAlign: "center", color: "rgba(0,0,0,0.6)", marginTop: "1em" }}>
          Sem eventos mano :(
        </p>
      )}

      {eventos.map((evento) => (
        <CardEvento
          key={evento.id}
          titulo={evento.titulo}
          local={evento.local}
          data={evento.data}
          esporte={evento.esporte}
          capacidade={evento.capacidade}
          foiSalvo={opcaoSelecionada === "eventosSalvos"}
          onUnsave={async () => {
            try {
              await removeSavedEventForUser(uid!, evento.id);
              setEventos((prev) => prev.filter((e) => e.id !== evento.id));
            } catch (err) {
              console.error("Erro removendo evento salvo:", err);
            }
          }}
        />
      ))}
    </HistoricoUsuarioComponent>
  );
}
