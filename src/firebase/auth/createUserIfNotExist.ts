import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import { db } from "../config";

export const createUserIfNotExist = async (
  user: User,
  extraData?: { username?: string; photoURL?: string }
) => {
  const userRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(userRef);

  const displayName = extraData?.username ?? user.displayName ?? null;
  const photoURL = extraData?.photoURL ?? user.photoURL ?? null;

  if (!snap.exists()) {
    // Cria novo doc
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? null,
      displayName,
      username: extraData?.username ?? null,
      photoURL,
      createdAt: new Date().toISOString(),
      eventosCriados: 0,
      participacoes: 0,
      conexoes: 0,
    });
  } else {
    // Atualiza campos que estão faltando
    const existing = snap.data() as any;
    const updates: any = {};
    if (displayName && !existing.displayName) updates.displayName = displayName;
    if (photoURL && !existing.photoURL) updates.photoURL = photoURL;
    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
    }
  }

  // Atualiza displayName no Auth
  if (displayName && user.displayName !== displayName) {
    try {
      await updateProfile(user, { displayName });
    } catch (err) {
      console.warn("Erro ao atualizar displayName no Auth:", err);
    }
  }
};
