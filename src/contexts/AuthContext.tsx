import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthListener } from "../firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import { useSignUpWithEmail, resendVerification as resendVerificationFn, signInWithEmail } from "../firebase";
import { createUserIfNotExist, uploadProfileImage, useUpdateUserProfile } from "../firebase";
import { useUserData, type UserDataProfile } from "../firebase";

type SignupProps = { email: string; password: string; username: string; file?: File | null };

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: UserDataProfile | null;
  loading: boolean;
  signUp: (props: SignupProps) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerification: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  updateProfile: (profile: { bio?: string; username?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const { userData, loading: userDataLoading } = useUserData(firebaseUser?.uid ?? null);

  const { signUp: signUpWithEmail } = useSignUpWithEmail();
  const { updateProfile: updateUserProfile } = useUpdateUserProfile(firebaseUser);

  useEffect(() => {
    const unsubscribe = onAuthListener((user) => {
      setFirebaseUser(user);
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const loading = useMemo(() => !authInitialized || userDataLoading, [authInitialized, userDataLoading]);

  const signUp = async ({ email, password, username, file }: SignupProps) => {
    try {
      await signUpWithEmail(email, password);

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Erro ao criar usuário.");

      let photoURL: string | undefined;
      if (file) photoURL = await uploadProfileImage(currentUser.uid, file);

      await createUserIfNotExist(currentUser, { username: username ?? undefined, photoURL });

      setFirebaseUser(auth.currentUser);
    } catch (err) {
      console.error("signUp error:", err);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      if (!user) throw new Error("Erro no login :(.");
      setFirebaseUser(user);
    } catch (err) {
      console.error("signIn error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setFirebaseUser(null);
  };

  const resendVerification = async () => {
    if (!firebaseUser) throw new Error("Sem conta.");
    await resendVerificationFn(firebaseUser);
  };

  const uploadProfilePicture = async (file: File) => {
    if (!firebaseUser) throw new Error("Sem conta cara!.");
    const url = await uploadProfileImage(firebaseUser.uid, file);
    return url;
  };

  const updateProfile = async (profile: { bio?: string; username?: string }) => {
    if (!firebaseUser) throw new Error("Sem conta não dá viado..");
    await updateUserProfile(profile, () => {
      Object.assign(firebaseUser, { displayName: profile.username ?? firebaseUser.displayName });
    });
  };

  const value: AuthContextType = {
    firebaseUser,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    resendVerification,
    uploadProfilePicture,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth tem que ser usado com AuthProvider...");
  return ctx;
};
