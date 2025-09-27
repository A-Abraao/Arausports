import { useRef, useState } from "react";
import styled from "styled-components";
import { Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

type Props = {
  existingImageUrl?: string;
  folder?: string;
  maxFileSizeMB?: number;
  accept?: string;
  onUpload?: (url: string, path: string) => void;
};

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

export default function ImageUpload({
  existingImageUrl,
  folder = "event-images",
  maxFileSizeMB = 5,
  accept = "image/*",
  onUpload,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(existingImageUrl);

  const pickFile = () => inputRef.current?.click();

  const handleFile = (file?: File) => {
    if (!file) return;

    const maxBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`Arquivo muito grande. Máx ${maxFileSizeMB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(String(e.target?.result || ""));
    reader.readAsDataURL(file);

    const storage = getStorage();
    const filename = `${Date.now()}-${uuidv4()}-${file.name.replace(
      /\s+/g,
      "_"
    )}`;
    const path = `${folder}/${filename}`;
    const ref = storageRef(storage, path);

    const task = uploadBytesResumable(ref, file);
    task.on(
      "state_changed",
      undefined,
      (err) => {
        console.error("upload error", err);
        alert("Erro ao enviar. Tente novamente.");
      },
      () => {
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
          onUpload?.(downloadURL, path);
        });
      }
    );
  };

  const removeImage = () => {
    setPreview(undefined);
    onUpload?.("", "");
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
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                
              </Typography>
            </UploadRow>
          </UploadOverlay>
        )}
      </Container>
    </>
  );
}
