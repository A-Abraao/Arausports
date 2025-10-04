import { auth, db, googleProvider } from "../config";
import { useState } from "react";
import { signInWithPopup, type User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

//permitir o cara entrar na conta dele
export function useGoogleAuth () {
  const [ data, setData ] = useState<User | null>(null)
  const [ loading, setLoading ] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function login() {
    setLoading(true)
    setError(null)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      const ref = doc(db, "usuarios", firebaseUser.uid)
      await setDoc(ref, {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? null,
        displayName: firebaseUser.displayName ?? null,
        photoURL: firebaseUser.photoURL ?? null,
        bio: null,
        eventosCriados: 0,
        participacoes: 0,
        conexoes: 0,
        lastLogin: serverTimestamp()
      },

      { merge: true })
      setData(firebaseUser)
      return firebaseUser

    } catch(err) {
      const e = err as Error;
      setError(e);
      throw e;
    } finally {
      setLoading(false)

    }
  }

  return { data, loading, error, login }
};
