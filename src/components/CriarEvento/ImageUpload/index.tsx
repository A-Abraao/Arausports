import { useRef, useState } from "react";
import styled from "styled-components";
import { Button, IconButton, LinearProgress, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";


type Props = {
  existingImageUrl?: string;
  folder?: string;
  maxFileSizeMB?: number;
  accept?: string;
  onUpload?: (url: string, path: string) => void;
};

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const Preview = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 0.5rem;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFile = () => inputRef.current?.click();

  const handleFile = (file?: File) => {
    setError(null);
    if (!file) return;

    
    const maxBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Arquivo muito grande. Máx ${maxFileSizeMB} MB.`);
      return;
    }

    
    const reader = new FileReader();
    reader.onload = (e) => setPreview(String(e.target?.result || ""));
    reader.readAsDataURL(file);

    
    const storage = getStorage();
    const filename = `${Date.now()}-${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;
    const path = `${folder}/${filename}`;
    const ref = storageRef(storage, path);

    setUploading(true);
    setProgress(0);

    const task = uploadBytesResumable(ref, file);
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (err) => {
        console.error("upload error", err);
        setError("Erro ao enviar. Tente novamente.");
        setUploading(false);
        setProgress(null);
      },
      () => {
        // finished
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
          setUploading(false);
          setProgress(null);
          onUpload?.(downloadURL, path);
        });
      }
    );
  };

  return (
    <div>
      <Wrapper>
        <Preview>
          {preview ? (
            <img src={preview} alt="preview" />
          ) : (
            <Typography variant="caption">Sem imagem</Typography>
          )}
        </Preview>

        <div style={{ flex: 1 }}>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={pickFile}
              disabled={uploading}
            >
              {uploading ? "Enviando..." : "Enviar imagem"}
            </Button>

            <IconButton
              onClick={() => {
                setPreview(undefined);
                onUpload?.("", ""); 
              }}
              size="large"
            >
              <DeleteIcon />
            </IconButton>
          </div>

          {progress !== null && (
            <div style={{ marginTop: 8 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption">{progress}%</Typography>
            </div>
          )}

          {error && (
            <Typography variant="caption" color="error" style={{ display: "block", marginTop: 6 }}>
              {error}
            </Typography>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
