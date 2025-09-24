import { initializeApp } from "firebase/app";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  type User, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const uploadProfileImage = async (uid: string, file: File) => {
  const ref = storageRef(storage, `profile_pictures/${uid}/${file.name}`);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  await updateDoc(doc(db, "users", uid), { photoURL: url });
  return url;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const onAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);

// 🔹 NOVO: função para buscar dados do usuário no Firestore
export const getUserData = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
  }
  return userCredential.user;
};

export const createUserDocIfNotExists = async (user: User, extraData?: { username?: string; photoURL?: string }) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? null,
      username: extraData?.username ?? null,
      photoURL: extraData?.photoURL ?? null,
      createdAt: new Date().toISOString(),
    });
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  if (!userCredential.user.emailVerified) {
    await signOut(auth); // bloqueia acesso
    throw new Error("Verifique seu e-mail antes de acessar.");
  }

  return userCredential.user;
};

export const resendVerification = async (user: User) => {
  if (user && !user.emailVerified) {
    await sendEmailVerification(user);
  }
};
