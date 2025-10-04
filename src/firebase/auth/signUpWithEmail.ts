import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  linkWithCredential, 
  sendEmailVerification, 
  updateProfile, 
  EmailAuthProvider 
} from "firebase/auth";
import { auth, db } from "../config";
import { doc, setDoc } from "firebase/firestore";

type SignUpResult = {
  user: any | null;
  error: Error | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
};

export function useSignUpWithEmail(): SignUpResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        if (methods.includes("password")) {
          throw new Error("Email já cadastrado com senha.");
        }

        if (methods.includes("google.com")) {
          const current = auth.currentUser;
          if (current && current.email?.toLowerCase() === email.toLowerCase()) {
            const credential = EmailAuthProvider.credential(email, password);
            const linkedUserCred = await linkWithCredential(current, credential);
            if (!linkedUserCred.user.emailVerified) {
              await sendEmailVerification(linkedUserCred.user);
            }
            setUser(linkedUserCred.user);
            return;
          }
          throw new Error("Este email já está em uso por outra conta Google.");
        }

        throw new Error(`Este email já está em uso: ${methods.join(", ")}.`);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const defaultData = {
        displayName: "Novo usuário",
        bio: "Essa informação é visível para geral, só para avisar..",
        email: newUser.email,
        eventosCriados: 0,
        participacoes: 0,
        conexoes: 0,
      };

      await updateProfile(newUser, { displayName: defaultData.displayName });

      await setDoc(doc(db, "usuarios", newUser.uid), defaultData);
      
      if (!newUser.emailVerified) {
        await sendEmailVerification(newUser);
      }

      setUser(newUser);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, signUp };
}
