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
};

export function EntrarBt({ eventoId }: EntrarBtProps) {
  const handleEntrar = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("Usuário não está logado");
        return;
      }

      await entrarNoEvento(eventoId, user.uid);
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
