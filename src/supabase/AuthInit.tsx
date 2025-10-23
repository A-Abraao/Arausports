import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./supabaseClient";
import { safeAuthInit, cleanupLocalSessionKeys } from "./safeSession";

type AuthContextValue = {
  session: any | null;
  initializing: boolean;
};

const AuthContext = createContext<AuthContextValue>({ session: null, initializing: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    let sub: any = null;

    (async () => {
      try {
        const sess = await safeAuthInit();
        if (!mounted) return;
        setSession(sess);
      } catch (err) {
        console.warn("AuthProvider init error:", err);
        cleanupLocalSessionKeys();
        setSession(null);
      } finally {
        if (mounted) setInitializing(false);
      }

      try {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session ?? null);
        });
        sub = listener;
      } catch (e) {
        console.warn("AuthProvider subscribe error:", e);
      }
    })();

    return () => {
      mounted = false;
      try {
        sub?.subscription?.unsubscribe?.();
        sub?.unsubscribe?.();
      } catch {}
    };
  }, []);

  return <AuthContext.Provider value={{ session, initializing }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
