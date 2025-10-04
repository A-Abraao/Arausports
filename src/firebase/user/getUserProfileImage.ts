import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config";

export function useGetProfilePhoto (userId: string | null) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setUserPhoto(null)
      setLoading(false)
      return
    }

    const userRef = doc(db, "usuarios", userId)

    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const { photoURL } = snap.data()
          setUserPhoto(photoURL as string)
        } else {
          setUserPhoto(null)
        }
      setLoading(false)
      },
      (err) => {
        setErro(err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [userId])
  return { userPhoto, loading, erro }
}

