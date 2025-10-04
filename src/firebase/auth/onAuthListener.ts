import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../config";

export const onAuthListener = (cb: (user: User | null) => void) => {
  const unsubscribe = onAuthStateChanged(auth, cb);
  return unsubscribe;
};
