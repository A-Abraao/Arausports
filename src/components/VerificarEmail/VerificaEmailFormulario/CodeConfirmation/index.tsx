import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";

//estilização da aprada
const CodeGrid = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  margin-top: 0.6rem;
  margin-bottom: 0.8rem;
`;

const DigitInput = styled.input`
  width: clamp(3rem, 7vw, 3.75rem);
  height: clamp(3rem, 7vw, 3.75rem);
  font-size: clamp(1.25rem, 2.4vw, 1.5rem);
  text-align: center;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  background: #fafafa;
  transition: box-shadow 120ms ease, border-color 120ms ease;
  &::placeholder {
    color: rgba(0, 0, 0, 0.2);
  }
  &:focus {
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.03);
    border-color: var(--ring);
    background: #fff;
  }
`;

//props ou argumentos que o componente recebe
export interface CodeInputProps {
  length?: number; // quantos dígitos
  value?: string[]; // se fornecido, o componente fica controlado
  onChange?: (digits: string[]) => void; // notifica sempre que mudar
  onComplete?: (code: string) => void; // quando todos os dígitos foram preenchidos
  placeholder?: string;
  ariaLabelPrefix?: string;
}

export type CodeInputHandle = {
  focusFirst: () => void;
  getValue: () => string;
};

//componente criado com farwardRef
export const CodeInput = forwardRef<CodeInputHandle, CodeInputProps>(
  (
    {
      length = 6,
      value,
      onChange,
      onComplete,
      placeholder = "•",
      ariaLabelPrefix = "Dígito",
    },
    ref
  ) => {
    const isControlled = Array.isArray(value);
    const [internalDigits, setInternalDigits] = useState<string[]>(
      () => value ?? Array(length).fill("")
    );

    // refs para inputs
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    // sincroniza controlled com o intenro
    useEffect(() => {
      if (isControlled && value) {
        setInternalDigits((_) => {
          const nd = Array(length).fill("");
          for (let i = 0; i < length; i++) nd[i] = value[i] ?? "";
          return nd;
        });
      }
    }, [value, length]);

    // expoem metodos 
    useImperativeHandle(ref, () => ({
      focusFirst: () => inputsRef.current[0]?.focus(),
      getValue: () => internalDigits.join(""),
    }), [internalDigits]);

    // helper para propagar alteração
    const propagate = (nd: string[]) => {
      if (onChange) onChange(nd);
      if (onComplete && nd.join("").length === length && !nd.includes("")) {
        onComplete(nd.join(""));
      }
    };

    const handleChange = (index: number, raw: string) => {
      const value = raw.replace(/[^0-9]/g, "").slice(0, 1);
      setInternalDigits((d) => {
        const nd = [...d];
        nd[index] = value;
        // se controlado, não sobrescrever local (mas ainda atualizamos estado local pra refletir visual)
        return nd;
      });
      // se não for digitado, apenas propaga
      setTimeout(() => {
        const nd = [...(isControlled ? (value ? value : internalDigits) : internalDigits)];
        // recomputa correto a partir dos inputs lá
        const current = inputsRef.current.map((el) => (el ? el.value : ""));
        for (let i = 0; i < length; i++) nd[i] = current[i] ?? "";
        propagate(nd);
      }, 0);

      // foca próximo digito
      const next = inputsRef.current[index + 1];
      if (value && next) next.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      const key = e.key;
      if (key === "Backspace") {
        if (!inputsRef.current[index]?.value) {
          const prev = inputsRef.current[index - 1];
          if (prev) {
            prev.focus();
            setInternalDigits((d) => {
              const nd = [...d];
              nd[index - 1] = "";
              propagate(nd);
              return nd;
            });
          }
        } else {
          // se tem valor no atual, ele apaga o conteudo (comportamento normal)
          setTimeout(() => {
            const nd = inputsRef.current.map((el) => el?.value ?? "");
            setInternalDigits(nd);
            propagate(nd);
          }, 0);
        }
      } else if (key === "ArrowLeft") {
        inputsRef.current[Math.max(0, index - 1)]?.focus();
      } else if (key === "ArrowRight") {
        inputsRef.current[Math.min(length - 1, index + 1)]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
      if (!pasted) return;
      e.preventDefault();
      const arr = pasted.slice(0, length).split("");
      setInternalDigits((d) => {
        const nd = [...d];
        for (let i = 0; i < length; i++) nd[i] = arr[i] ?? "";
        // atualizar inputs no site se o controle for ativado no Onchange
        setTimeout(() => {
          for (let i = 0; i < length; i++) {
            if (inputsRef.current[i]) inputsRef.current[i]!.value = nd[i] ?? "";
          }
          propagate(nd);
        }, 0);
        return nd;
      });
      const lastIndex = Math.min(arr.length, length) - 1;
      const toFocus = inputsRef.current[lastIndex + 1] ?? inputsRef.current[length - 1];
      toFocus?.focus();
    };

    return (
      <CodeGrid onPaste={handlePaste}>
        {Array.from({ length }).map((_, i) => (
          <DigitInput
            key={i}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={internalDigits[i] ?? ""}
            onChange={(ev) => handleChange(i, ev.target.value)}
            onKeyDown={(ev) => handleKeyDown(ev, i)}
            placeholder={placeholder}
            aria-label={`${ariaLabelPrefix} ${i + 1}`}
          />
        ))}
      </CodeGrid>
    );
  }
);

