import { supabase } from "./supabaseClient";

export function cleanupLocalSessionKeys() {
  try {
    Object.keys(localStorage || {}).forEach((k) => {
      if (k.startsWith("sb-")) localStorage.removeItem(k);
    });
    console.warn("cleanupLocalSessionKeys: chaves sb- removidas.");
  } catch (e) {
    console.warn("cleanupLocalSessionKeys erro:", e);
  }
}

export async function safeAuthInit() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  } catch (err: any) {
    console.warn("safeAuthInit: getSession falhou:", err);
    cleanupLocalSessionKeys();
    return null;
  }
}
