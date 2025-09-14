import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

// função para logar com Google e salvar no Firestore
export async function loginComGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // salvar ou atualizar o usuario salvo lá
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: user.displayName,
      email: user.email,
      foto: user.photoURL,
    }, { merge: true });

    console.log("Usuário logado e salvo:", user);
    return user; // opcional, pode usar para atualizar estado
  } catch (error) {
    console.error("Erro no login com Google:", error);
  }
}
