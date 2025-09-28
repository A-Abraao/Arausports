import { initializeApp } from "firebase/app";
import { doc, setDoc, getDoc, updateDoc, increment, runTransaction } from "firebase/firestore";
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
import { updateProfile } from "firebase/auth";
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


export const updateUserBio = async (uid: string, bio: string) => {
    const userRef = doc(db, "users", uid);
    
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        bio,
        createdAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        bio,
        updatedAt: new Date().toISOString(),
      });
    }
};

export const updateUserProfile = async (
  uid: string,
  data: { bio?: string; username?: string }
) => {
  const userRef = doc(db, "users", uid);
  
  const snap = await getDoc(userRef);

  const dataToUpdateInFirestore: { bio?: string; displayName?: string; updatedAt: string } = {
    updatedAt: new Date().toISOString()
  };

  if (data.bio) {
    dataToUpdateInFirestore.bio = data.bio;
  }
  if (data.username) {
    dataToUpdateInFirestore.displayName = data.username;
  }

  if (snap.exists()) {
    await updateDoc(userRef, dataToUpdateInFirestore);
  } else {
    
    await setDoc(userRef, {
      uid,
      ...dataToUpdateInFirestore,
      createdAt: new Date().toISOString(),
    });
  }

  if (data.username) {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: data.username });
    }
  }
};

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
    await signOut(auth); 
    throw new Error("Verifique seu e-mail antes de acessar.");
  }

  return userCredential.user;
};

export const resendVerification = async (user: User) => {
  if (user && !user.emailVerified) {
    await sendEmailVerification(user);
  }
};

export const entrarNoEvento = async (
  eventoId: string,
  ownerId: string,
  participantId: string
) => {
  const eventoRef = doc(db, "users", ownerId, "eventos", eventoId);
  const participanteRef = doc(db, "users", ownerId, "eventos", eventoId, "participantes", participantId);

  await runTransaction(db, async (tx) => {
    const eventoSnap = await tx.get(eventoRef);
    if (!eventoSnap.exists()) {
      throw new Error("Evento não existe.");
    }

    const eventoData = eventoSnap.data() as any;
    const capacidade = Number(eventoData.capacidade ?? 0);
    const participantesAtuais = Number(eventoData.participantesAtuais ?? 0);

    if (capacidade <= 0) {
      throw new Error("Capacidade do evento inválida.");
    }

    if (participantesAtuais >= capacidade) {
      throw new Error("Evento lotado.");
    }

    const participanteSnap = await tx.get(participanteRef);
    if (participanteSnap.exists()) {
      throw new Error("Você já está inscrito nesse evento.");
    }

    tx.update(eventoRef, { participantesAtuais: increment(1) });
    tx.set(participanteRef, {
      userId: participantId,
      joinedAt: new Date().toISOString(),
    });
  });
};

export const sairDoEvento = async (
  eventoId: string,
  ownerId: string,
  participantId: string
) => {
  const eventoRef = doc(db, "users", ownerId, "eventos", eventoId);
  const participanteRef = doc(db, "users", ownerId, "eventos", eventoId, "participantes", participantId);

  await runTransaction(db, async (tx) => {
    const participanteSnap = await tx.get(participanteRef);
    if (!participanteSnap.exists()) {
      throw new Error("Você não está inscrito nesse evento.");
    }

    const eventoSnap = await tx.get(eventoRef);
    if (!eventoSnap.exists()) {
      throw new Error("Evento não existe.");
    }

    const eventoData = eventoSnap.data() as any;
    const participantesAtuais = Number(eventoData.participantesAtuais ?? 0);

    const novoValor = Math.max(0, participantesAtuais - 1);

    tx.update(eventoRef, { participantesAtuais: novoValor });
    tx.delete(participanteRef);
  });
};