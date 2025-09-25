import { useAuth } from "./AuthContext";

export function useUserData() {
  const { userData } = useAuth();

  const photoURL = userData?.photoURL || null;
  const userName = userData?.displayName || "New User";

  return { photoURL, userName };
}
