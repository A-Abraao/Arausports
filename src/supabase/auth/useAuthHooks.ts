import { useAuth } from "./useSupabaseAuth";

export function useEmailAuth() {
  const { signIn, loading, error } = useAuth();
  return {
    signIn,
    loading,
    error,
  };
}

export function useGoogleAuth() {
  const { signInWithGoogle, loading, error } = useAuth();
  return {
    signInWithGoogle,
    loading,
    error,
  };
}
