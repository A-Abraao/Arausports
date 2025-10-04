import type { User } from "firebase/auth";

export interface ExtraUserData {
  username?: string;
  photoURL?: string;
}

export interface FirebaseUserData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  username?: string | null;
  photoURL?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type OnAuthCallback = (user: User | null) => void;
