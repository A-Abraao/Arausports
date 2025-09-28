import styled from "styled-components";
import { Button } from "@mui/material";
import { entrarNoEvento, auth } from "../../../../../../firebase";

const ButtonContainer = styled.div`
  margin-top: 0.75em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

type EntrarBtProps = {
  eventoId: string;
  ownerId?: string;
};

export function EntrarBt({ eventoId, ownerId }: EntrarBtProps) {
  const handleEntrar = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("Usuário não está logado");
        return;
      }

      if (!ownerId) {
        console.error("OwnerId do evento não informado — não é possível entrar.");
        return;
      }

      await entrarNoEvento(eventoId, ownerId, user.uid);
      console.log("Entrou no evento com sucesso!");
    } catch (error) {
      console.error("Não deu para entrar no evento:", error);
    }
  };

  return (
    <ButtonContainer>
      <Button
        sx={{
          background: "springgreen",
          height: "2.5em",
          borderRadius: "0.5em",
          textTransform: "none",
          color: "white",
        }}
        onClick={handleEntrar}
      >
        Se juntar
      </Button>
    </ButtonContainer>
  );
}
