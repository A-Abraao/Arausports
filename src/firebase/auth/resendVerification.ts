import { sendEmailVerification, type User } from "firebase/auth";

export const resendVerification = async (user: User) => {
  if (!user) throw new Error("Nenhum usuário logado.");
  if (!user.emailVerified) {
    await sendEmailVerification(user);
  }
};
