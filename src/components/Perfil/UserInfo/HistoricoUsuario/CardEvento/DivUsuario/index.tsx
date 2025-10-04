import styled from "styled-components";
import { Usuario } from "./Usuario"; 
import { formatarDataDMA } from "../../../../../../firebase";
import { SalvarButton } from "../../../../../HomePage/Esportes/EsportesGrid/Card";

const DivUsuarioComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const TipoDoEsporte = styled.span`
  color: white;
  background: var(--secondary);
  border-radius: 9999px;
  padding: 0.45em 0.95em;
  font-size: 0.75em;
  font-weight: 450;
  transition: background-color 0.5s ease-in-out;

  &:hover {
    background: var(--ring);
  }
`;

type DivUsuarioProps = {
  data: string;
  esporte: string;
  foiSalvo?: boolean;
  loading: boolean
  onToggleSave?: () => Promise<void> | void;
};

export function DivUsuario({ data, esporte, loading,foiSalvo = false, onToggleSave }: DivUsuarioProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      try {
        await onToggleSave();
      } catch (err) {
        console.error("Erro no toggle save:", err);
      }
    }
  };

  return (
    <DivUsuarioComponent>
      <Usuario data={formatarDataDMA(data)} foiSalvo={foiSalvo} />
      <RightGroup>
        {foiSalvo && onToggleSave && (
          <SalvarButton
            ativo={!!foiSalvo}
            onClick={handleClick}
            loading={loading}
          />
        )}
        <TipoDoEsporte>{esporte}</TipoDoEsporte>
      </RightGroup>
    </DivUsuarioComponent>
  );
}
