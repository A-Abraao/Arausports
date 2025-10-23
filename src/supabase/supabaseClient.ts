import { createClient, type SupabaseClient } from '@supabase/supabase-js';

//url da banco de dados supabse juntamente com a url da anon key, nescessários para fazer usar o supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined'
  );
}

// guarda no globalThis para evitar múltiplas instâncias
declare global {
  // eslint-disable-next-line no-var
  var __supabase_client__: SupabaseClient | undefined;
}

//criar e pegar o cliente supabase para garantir autenticação e fluxo de usuario no site
const getClient = () => {
  if (globalThis.__supabase_client__) return globalThis.__supabase_client__!;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  globalThis.__supabase_client__ = client;
  return client;
};

//ai depois nós manda esse cliente para a rapaziadinha usar...
export const supabase: SupabaseClient = getClient();

