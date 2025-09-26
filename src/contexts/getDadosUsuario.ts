import { useAuth } from "./AuthContext";

export function useUserData() {
  const { userData } = useAuth();

  const photoURL = userData?.photoURL || null;
  const userName = userData?.displayName || "New User";
  const bio = userData?.bio || "mano só criei a conta aqui e é isso..";

  return { photoURL, userName, bio };
}
