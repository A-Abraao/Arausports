import { auth, db, googleProvider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

//permitir o cara entrar na conta dele
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const ref = doc(db, "users", user.uid);
    await setDoc(
      ref,
      {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};
