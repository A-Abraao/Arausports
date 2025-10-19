import { useState, useCallback } from "react";
import { useAuth } from "./useSupabaseAuth";

export function useEmailAuth() {
  const { signIn: signInBase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInBase(email, password);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signInBase]);

  return {
    signIn,
    loading,
    error,
  };
}

export function useGoogleAuth() {
  const { signInWithGoogle: signInGoogleBase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInGoogleBase();
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signInGoogleBase]);

  return {
    signInWithGoogle,
    loading,
    error,
  };
}
