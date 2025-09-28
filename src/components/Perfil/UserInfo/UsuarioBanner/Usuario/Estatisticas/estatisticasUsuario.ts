import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../../../firebase";
import { useAuth } from "../../../../../../contexts/AuthContext";

export function estatisticasUsuario() {
  const { firebaseUser } = useAuth();
  const [stats, setStats] = useState({ created: 0, joined: 0 });
  
  useEffect(() => {
    if (!firebaseUser) return;

    const uid = firebaseUser.uid;

    const fetchStats = async () => {
      try {
        const eventosCriadosRef = collection(db, "users", uid, "eventos");
        const eventosCriadosSnap = await getDocs(eventosCriadosRef);
        const createdCount = eventosCriadosSnap.size;

        const usersRef = collection(db, "users");
        const allUsersSnap = await getDocs(usersRef);
        let joinedCount = 0;

        for (const userDoc of allUsersSnap.docs) {
          const eventosRef = collection(db, "users", userDoc.id, "eventos");
          const eventosSnap = await getDocs(eventosRef);
          
          for (const eventoDoc of eventosSnap.docs) {
            const participanteRef = collection(db, "users", userDoc.id, "eventos", eventoDoc.id, "participantes");
            const participanteSnap = await getDocs(participanteRef);
            const isParticipante = participanteSnap.docs.some(doc => doc.id === uid);
            if (isParticipante) joinedCount++;
          }
        }

        setStats({ created: createdCount, joined: joinedCount });

      } catch (err) {
        console.error("Erro ao buscar estatísticas do cara viado:", err);
      }
    };

    fetchStats();
  }, [firebaseUser]);

  return stats;
}
