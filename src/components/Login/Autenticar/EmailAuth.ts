import { auth, db } from "../../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Registrar novo usuário com email/senha e salvar no Firestore
const registerWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    createdAt: serverTimestamp(),
  });
};

// Login com email/senha (atualiza lastLogin no Firestore)
export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
};
