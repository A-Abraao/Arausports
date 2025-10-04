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
  linkWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
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

const getUserData = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

export const signUpWithEmail = async (username: string, email: string, password: string) => {
  const methods = await fetchSignInMethodsForEmail(auth, email);

  if (methods.length > 0) {
    if (methods.includes("password")) {
      throw new Error("E-mail já cadastrado com e-mail/senha. Faça login ou recupere a senha.");
    }

    if (methods.includes("google.com")) {
      const current = auth.currentUser;

      if (current && current.email?.toLowerCase() === email.toLowerCase()) {
        const credential = EmailAuthProvider.credential(email, password);
        try {
          const linkedUserCred = await linkWithCredential(current as User, credential);

          if (!linkedUserCred.user.emailVerified) {
            await sendEmailVerification(linkedUserCred.user);
          }
          return linkedUserCred.user;
        } catch (err: any) {
          throw new Error(err?.message ?? "Erro ao vincular credencial.");
        }
      } else {
        throw new Error(
          "Já existe uma conta com esse e-mail usando Google. Faça login com Google para vincular uma senha."
        );
      }
    }

    throw new Error(
      `E-mail já cadastrado com outro provedor: ${methods.join(", ")}. Utilize esse provedor para entrar.`
    );
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: username });

    await sendEmailVerification(userCredential.user);
  }

  return userCredential.user;
};

export const createUserDocIfNotExists = async (
  user: User,
  extraData?: { username?: string; photoURL?: string }
) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  
  const displayName = extraData?.username ?? user.displayName ?? null;
  const photoURL = extraData?.photoURL ?? user.photoURL ?? null;

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? null,
      displayName,
      username: extraData?.username ?? null,
      photoURL,
      createdAt: new Date().toISOString(),
    });
  } else {
    const existing = snap.data() as any;
    const updates: any = {};
    if (displayName && !existing.displayName) updates.displayName = displayName;
    if (photoURL && !existing.photoURL) updates.photoURL = photoURL;
    if (Object.keys(updates).length) {
      await updateDoc(userRef, updates);
    }
  }

  if (displayName && user.displayName !== displayName) {
    try {
      await updateProfile(user, { displayName });
    } catch (err) {
    
    }
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