// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";

import { onAuth } from "../firebase";
import { signUpWithEmail, resendVerification as resendVerificationFn, signInWithEmail } from "../firebase"; 


import { getUserData, createUserDocIfNotExists, uploadProfileImage } from "../firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";

type SignupProps = { email: string; password: string; username?: string; file?: File | null };

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: any | null;
  loading: boolean;
  signUp: (props: SignupProps) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerification: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuth(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async ({ email, password, username, file }: SignupProps) => {
    // Cria usuário e envia e-mail de verificação (signUpWithEmail do seu firebase.ts)
    const user = await signUpWithEmail(email, password);
    if (!user) throw new Error("Erro ao criar usuário.");

    // Se tiver foto, faz upload e pega URL
    let photoURL: string | null = null;
    if (file) {
      photoURL = await uploadProfileImage(user.uid, file);
    }

    // Cria doc no Firestore (sem senha)
    const safeUsername = username ?? undefined;
const safePhotoURL = photoURL ?? undefined;
await createUserDocIfNotExists(user, { username: safeUsername, photoURL: safePhotoURL });

  };

  const signIn = async (email: string, password: string) => {
    // signInWithEmail no seu firebase lança erro se email não estiver verificado
    const user = await signInWithEmail(email, password);
    if (!user) throw new Error("Erro no login.");
    // Puxa dados atualizados do Firestore
    const data = await getUserData(user.uid);
    setUserData(data);
    setFirebaseUser(user);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setFirebaseUser(null);
    setUserData(null);
  };

  const resendVerification = async () => {
    if (!firebaseUser) throw new Error("Nenhum usuário logado.");
    await resendVerificationFn(firebaseUser);
  };

  const uploadProfilePicture = async (file: File) => {
    if (!firebaseUser) throw new Error("Nenhum usuário logado.");
    const url = await uploadProfileImage(firebaseUser.uid, file);
    // atualiza localmente
    const data = await getUserData(firebaseUser.uid);
    setUserData(data);
    return url;
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        loading,
        signUp,
        signIn,
        signOut,
        resendVerification,
        uploadProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
