import { Timestamp } from "firebase/firestore";

export function parseToDate(input: any): Date | null {
  if (!input) return null;

  if (input instanceof Timestamp) return input.toDate();

  if (typeof input === "object" && input !== null && "seconds" in input && "nanoseconds" in input) {
    const ms = input.seconds * 1000 + Math.round(input.nanoseconds / 1e6);
    return new Date(ms);
  }

  if (typeof input === "string") {
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d;

    // tenta formatos comuns: dd/mm/yyyy ou dd-mm-yyyy, converter para ISO
    const brMatch = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (brMatch) {
      const day = Number(brMatch[1]);
      const month = Number(brMatch[2]) - 1;
      let year = Number(brMatch[3]);
      if (year < 100) year += 2000;
      const dd = new Date(year, month, day);
      return isNaN(dd.getTime()) ? null : dd;
    }

    return null;
  }

  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  return null;
}

export function formatDateForDb(input: any): string | null {
  const date = parseToDate(input);
  if (!date) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // yyyy-mm-dd
}

function pad2(n: number) { return String(n).padStart(2, "0"); }

//suporta a maioria dos tipos de data e horário
export function formatTimeForDb(input: any): string | null {
  if (!input) return null;

  // se já for um string hh:mm:ss
  if (typeof input === "string") {
    const hhmmss = input.match(/^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/);
    if (hhmmss) return hhmmss[0];

    // 8:30pm, "08:30am
    const mer = input.trim().match(/^(\d{1,2}):([0-5]\d)\s*([AaPp][Mm])$/);
    if (mer) {
      let h = Number(mer[1]);
      const m = Number(mer[2]);
      const ampm = mer[3].toLowerCase();
      if (ampm === "pm" && h < 12) h += 12;
      if (ampm === "am" && h === 12) h = 0;
      return `${pad2(h)}:${pad2(m)}`;
    }

    // tenta parse com Date, ex: 20:30:00 ou ISO
    const asDate = new Date(`1970-01-01T${input}`);
    if (!isNaN(asDate.getTime())) {
      const hh = pad2(asDate.getHours());
      const mm = pad2(asDate.getMinutes());
      const ss = pad2(asDate.getSeconds());
      return ss === "00" ? `${hh}:${mm}` : `${hh}:${mm}:${ss}`;
    }

    return null;
  }

  // objeto/timestamp/date
  const dt = parseToDate(input);
  if (dt) {
    const hh = pad2(dt.getHours());
    const mm = pad2(dt.getMinutes());
    const ss = pad2(dt.getSeconds());
    return ss === "00" ? `${hh}:${mm}` : `${hh}:${mm}:${ss}`;
  }

  return null;
}

//formatar data 06/10/2025
export function formatarDataDMA(input: any): string {
  const date = parseToDate(input);
  if (!date) return "Data inválida";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}


export function formatDateBR(input: any): string {
  const date = parseToDate(input);
  if (!date) return "Data inválida";

  // Intl já faz a formatação com nomes dos meses em pt-Bbr
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}