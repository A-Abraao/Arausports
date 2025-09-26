import React from "react";
import styled from "styled-components";

const CapacidadeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const CapacidadeInput = styled.input.attrs({ type: "number", min: 1 })`
  font-family: var(--font-principal);
  background: rgba(245, 245, 220, 0.5);
  border-radius: 0.35em;
  color: var(--muted-foreground);
  border: none;
  padding: 0.75em 1em;
  width: 100%;
  font-size: 0.95rem;
  &::placeholder {
    font-family: var(--font-principal);
  }
  &:focus {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

interface CapacidadeEventoProps {
  value?: number; 
  onChange?: (capacidade: number) => void;
}

export function CapacidadeEvento({ value = 0, onChange }: CapacidadeEventoProps) {
  
  const displayValue = value > 0 ? String(value) : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "") {
      
      onChange?.(0);
      return;
    }

    const parsed = parseInt(v, 10);
    const numericValue = isNaN(parsed) ? 0 : Math.max(1, parsed);
    onChange?.(numericValue);
  };

  return (
    <CapacidadeContainer>
      <Label>Capacidade Máxima *</Label>
      <CapacidadeInput
        placeholder="ex. 20 pessoas"
        value={displayValue}
        onChange={handleChange}
      />
    </CapacidadeContainer>
  );
}
