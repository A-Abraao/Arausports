import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAlert } from "../../Alerta/AlertProvider";

//criação do container que encapsula todos os components
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 18em;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(128, 128, 128, 0.4);
  backdrop-filter: blur(8px);
  transition: 0.3s;
  &:hover { background: rgba(128, 128, 128, 0.6); }

  @media (max-width: 1100px) {
    height: 15.5em;
  }
  @media (max-width: 900px) {
    height: 12.5em;
    border-radius: 0.45rem;
  }
`;

//container que encapsula a img do preview
const PreviewWrapper = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(128, 128, 128, 0.4);
  backdrop-filter: blur(8px);
`;

//imagem de preview
const Preview = styled.img`
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: cover;
  border-radius: 0.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 1100px) {
    max-height: 420px;
  }
  @media (max-width: 900px) {
    max-height: 260px;
    border-radius: 0.45rem;
  }
`;

//botao de remover a imagem que foi mandada 
const RemoveButton = styled(IconButton)`
  position: absolute !important;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  z-index: 2;
  &:hover { background: rgba(0, 0, 0, 0.8) !important; }
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  pointer-events: none;
  text-align: center;
`;

//porps para o hook funcionar perfeitamente
type Props = {
  existingImageUrl?: string;
  accept?: string;
  onUpload?: (file: File | null) => void;
};

//tipos permitidos de imagem, jpg, jpeg e png
const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];
//tamanho maximo da imagem
const MAX_BYTES = 5 * 1024 * 1024;

//função de upload, renderiza o componente para upload juntamente com os hooks e funcionalidades que permitem o componente funcionar
export default function ImageUpload({ existingImageUrl, accept = "image/*", onUpload }: Props) {
  //hooks e states que vai precisar para funcionr
  const { showAlert } = useAlert();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(existingImageUrl);
  const [file, setFile] = useState<File | null>(null);

  // sincroniza preview com prop externa (quando for reusado com existingImageUrl)
  useEffect(() => {
    setPreview(existingImageUrl ?? undefined);
    if (!existingImageUrl) {
      setFile(null);
    }
  }, [existingImageUrl]);

  // cleanup da URL object quando o componente desmonta ou quando trocamos preview
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try { URL.revokeObjectURL(preview); } catch {}
      }
    };
  }, [preview]);

  const pickFile = () => inputRef.current?.click();

  const handleFile = (file: File | null | undefined) => {
    //se tiver faltando ele cancela o upload logo de cara
    if (!file) return;

    // valida tamanho (bloqueia arquivos grandes já no client)
    if (file.size > MAX_BYTES) {
      // avisa que ta muito grande a imagem usando o provider de alert do app
      showAlert("Arquivo muito grande. Máx 5MB.", { severity: "error", duration: 3800, variant: "standard" });
      return;
    }

    // valida mime type básico (client-side)
    if (!file.type?.startsWith("image/") || !ALLOWED_MIMES.includes(file.type.toLowerCase())) {
      // manda um alert para ele mudar o tipo da imagem usando o provider
      showAlert("Selecione uma imagem válida (JPG/PNG).", { severity: "error", duration: 3800, variant: "standard" });
      return;
    }

    // permite visualização da imagem antes de enviar prévia
    const objUrl = URL.createObjectURL(file);
    // libera anterior (se era blob)
    if (preview && preview.startsWith("blob:")) {
      try { URL.revokeObjectURL(preview); } catch {}
    }
    setPreview(objUrl);
    setFile(file);
    onUpload?.(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    handleFile(chosen);
  };

  const removeImage = (ev?: any) => {
    ev?.stopPropagation?.();
    if (preview && preview.startsWith("blob:")) {
      try { URL.revokeObjectURL(preview); } catch {}
    }
    setPreview(undefined);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onUpload?.(null);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      <Container onClick={!preview ? pickFile : undefined}>
        {preview && (
          <>
            <PreviewWrapper />
            <Preview src={preview} alt="preview" />
            <RemoveButton onClick={removeImage}>
              <DeleteIcon />
            </RemoveButton>
          </>
        )}

        {!preview && (
          <UploadOverlay>
            <UploadRow>
              <CloudUploadIcon sx={{ fontSize: "2rem", color: "black" }} />
            </UploadRow>
          </UploadOverlay>
        )}
      </Container>
    </>
  );
}
