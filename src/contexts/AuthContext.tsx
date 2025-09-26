import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuth } from "../firebase";
import { signUpWithEmail, resendVerification as resendVerificationFn, signInWithEmail } from "../firebase"; 
import { getUserData, createUserDocIfNotExists, uploadProfileImage } from "../firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";
import { updateUserBio } from "../firebase";

type SignupProps = { email: string; password: string; username?: string; file?: File | null };

interface UserData {
  uid?: string;
  email?: string | null;
  username?: string | null;
  photoURL?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (props: SignupProps) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerification: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  updateBio: (bio: string) => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuth(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const data = (await getUserData(user.uid)) as UserData | null;
        if (data) {
          setUserData({ ...data, bio: data.bio ?? "" });
        } else {
          // fallback local: exibe bio vazia até o usuário editar/criar
          setUserData({
            uid: user.uid,
            email: user.email ?? null,
            bio: "",
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async ({ email, password, username, file }: SignupProps) => {
    const user = await signUpWithEmail(email, password);
    if (!user) throw new Error("Erro ao criar usuário.");

    let photoURL: string | null = null;
    if (file) {
      photoURL = await uploadProfileImage(user.uid, file);
    }

    const safeUsername = username ?? undefined;
    const safePhotoURL = photoURL ?? undefined;
    await createUserDocIfNotExists(user, { username: safeUsername, photoURL: safePhotoURL });
  };

  const signIn = async (email: string, password: string) => {
    const user = await signInWithEmail(email, password);
    if (!user) throw new Error("Erro no login.");
    const data = (await getUserData(user.uid)) as UserData | null;
    if (data) {
      setUserData({ ...data, bio: data.bio ?? "" });
    } else {
      setUserData({
        uid: user.uid,
        email: user.email ?? null,
        bio: "",
      });
    }
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
    const data = (await getUserData(firebaseUser.uid)) as UserData | null;
    if (data) {
      setUserData({ ...data, bio: data.bio ?? "" });
    } else {
      setUserData({
        uid: firebaseUser.uid,
        photoURL: url,
        bio: "",
      });
    }
    return url;
  };

  const updateBio = async (bio: string) => {
    if (!firebaseUser) throw new Error("Nenhum usuário logado.");
    await updateUserBio(firebaseUser.uid, bio);
    const data = (await getUserData(firebaseUser.uid)) as UserData | null;
    if (data) {
      setUserData({ ...data, bio: data.bio ?? "" });
    } else {
      
      setUserData({
        uid: firebaseUser.uid,
        bio,
      });
    }
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
        updateBio,
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
