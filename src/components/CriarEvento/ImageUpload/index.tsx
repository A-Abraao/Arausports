import { useRef, useState } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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
  &:hover {
    background: rgba(128, 128, 128, 0.6);
  }
`;

const PreviewWrapper = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(128, 128, 128, 0.4);
  backdrop-filter: blur(8px);
`;

const Preview = styled.img`
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: cover;
  border-radius: 0.5rem;
  position: relative;
  z-index: 1;
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

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled(IconButton)`
  position: absolute !important;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  z-index: 2;
  &:hover {
    background: rgba(0, 0, 0, 0.8) !important;
  }
`;

type Props = {
  existingImageUrl?: string;
  accept?: string;
  onUpload?: (file: File | null) => void; 
};

export default function ImageUpload({ existingImageUrl, accept = "image/*", onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(existingImageUrl);
  const [file, setFile] = useState<File | null>(null);

  const pickFile = () => inputRef.current?.click();

  const handleFile = (file?: File) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setFile(file);
    onUpload?.(file); 
  };

  const removeImage = () => {
    setPreview(undefined);
    setFile(null);
    onUpload?.(null); 
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
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
