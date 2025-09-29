import { Timestamp } from "firebase/firestore";

function parseToDate(input: any): Date | null {
  if (!input) return null;

  if (input instanceof Timestamp) {
    return input.toDate();
  }

  if (
    typeof input === "object" &&
    "seconds" in input &&
    "nanoseconds" in input
  ) {
    const ms =
      input.seconds * 1000 + Math.round(input.nanoseconds / 1e6);
    return new Date(ms);
  }

  if (typeof input === "string") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  return null;
}

export function formatarDataDMA(input: any): string {
  const date = parseToDate(input);
  if (!date) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date); 
}

export function formatDateBR(input: any): string {
  const date = parseToDate(input);
  if (!date) return "Data inválida";

  const diaMes = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
  }).format(date);

  return `${diaMes}, ${date.getFullYear()}`;
}
