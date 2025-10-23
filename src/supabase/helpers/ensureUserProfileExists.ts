import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

export async function ensureUserProfileExists(user: User | null) {
  if (!user?.id) return null;

  const metadata = (user.user_metadata ?? {}) as Record<string, any>;
  const nome = metadata.full_name ?? metadata.name ?? user.email?.split("@")[0] ?? null;
  const foto_url = metadata.avatar_url ?? metadata.picture ?? null;

  const payload = {
    id: user.id,
    nome,
    email: user.email ?? null,
    foto_url,
    bio: metadata.bio ?? "Sou novato gente!",
  };

  const { data, error } = await supabase
    .from("usuarios")
    .upsert(payload, { onConflict: "id" })
    .select()
    .maybeSingle();

  if (error) {
    console.warn("ensureUserProfileExists erro:", error);
    throw error;
  }

  return data;
}
