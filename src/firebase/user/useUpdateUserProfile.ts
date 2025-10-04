import { useState, useCallback } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile, type User } from "firebase/auth";
import { db } from "../config";

interface ProfileUpdateData {
  bio?: string;
  username?: string;
}

interface UpdateResult {
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: ProfileUpdateData, onSuccess?: () => void) => Promise<void>; 
}

export function useUpdateUserProfile(firebaseUser : User | null): UpdateResult {
  const uid = firebaseUser?.uid;

  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleUpdate = useCallback(async (data: ProfileUpdateData, onSuccess?: () => void) => {
    if (!uid) {
      setError(new Error("Usuário não autenticado."));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userRef = doc(db, "usuarios", uid);
      const snap = await getDoc(userRef);

      const dataToUpdate: { bio?: string; displayName?: string; updatedAt: string } = {
        updatedAt: new Date().toISOString(),
      };

      if (data.bio) dataToUpdate.bio = data.bio;
      if (data.username) dataToUpdate.displayName = data.username;

      if (snap.exists()) {
        await updateDoc(userRef, dataToUpdate);
      } else {
        await setDoc(userRef, {
          uid,
          ...dataToUpdate,
          createdAt: new Date().toISOString(),
        });
      }

      if (data.username && firebaseUser) {
        try {
          await updateProfile(firebaseUser, { displayName: data.username });
        } catch (err) {
          console.warn("Erro ao atualizar displayName no Auth:", err);
        }
      }
      
      if (onSuccess) {
          onSuccess();
      }

    } catch (err: any) {
      console.error("Erro no useUpdateUserProfile:", err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [uid, firebaseUser]);

  return {
    isLoading,
    error,
    updateProfile: handleUpdate,
  };
}