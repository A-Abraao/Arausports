import { getUserData } from "../firebase";

export const getUserProfile = async (uid: string) => {
  const data = await getUserData(uid);
  if (!data) return null;

  return {
    username: data.username ?? null,
    photoURL: data.photoURL ?? null,
  };
};