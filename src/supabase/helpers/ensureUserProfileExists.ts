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

  try {
    // tente upsert com onConflict id
    const res = await supabase
      .from("usuarios")
      .upsert([payload], { onConflict: "id" })
      .select()
      .maybeSingle();

    if (res.error) {
      // caso seja unique-violation em outra coluna (ex: email) ou conflito HTTP 409
      const err: any = res.error;
      console.warn("[ensureUserProfileExists] upsert erro:", err);

      // tentar recuperar por id primeiro
      try {
        const { data: byId, error: selErr } = await supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle();
        if (!selErr && byId) return byId;
      } catch (e) {
        console.warn("[ensureUserProfileExists] falha ao select by id:", e);
      }

      // se tiver email, tentar achar por email (caso conflito seja por email unique)
      if (user.email) {
        try {
          const { data: byEmail, error: selErr2 } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();
          if (!selErr2 && byEmail) return byEmail;
        } catch (e) {
          console.warn("[ensureUserProfileExists] falha ao select by email:", e);
        }
      }

      // se chegou aqui, re-lança para que chamador saiba que deu ruim
      throw res.error;
    }

    return res.data ?? null;
  } catch (err) {
    console.warn("ensureUserProfileExists catch:", err);
    throw err;
  }
}
