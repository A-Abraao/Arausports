import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0UrJd5l8qYLPqzAc730moSlXIk8stUp0",
  authDomain: "arausportes-ca1e0.firebaseapp.com",
  projectId: "arausportes-ca1e0",
  storageBucket: "arausportes-ca1e0.firebasestorage.app",
  messagingSenderId: "227513140849",
  appId: "1:227513140849:web:29ab222188aeba51a0bdd0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
