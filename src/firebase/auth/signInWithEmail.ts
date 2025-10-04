import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config";

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  if (!userCredential.user.emailVerified) {
    await signOut(auth);
    throw new Error("Verifique esse email ai rapaz..");
  }

  return userCredential.user;
};
