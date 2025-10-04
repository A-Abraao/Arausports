import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "../config";

export const uploadProfileImage = async (uid: string, file: File) => {
  const ref = storageRef(storage, `profile_pictures/${uid}/${file.name}`);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  await updateDoc(doc(db, "users", uid), { photoURL: url });
  return url;
};
