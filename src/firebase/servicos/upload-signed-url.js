import express from "express";
import { createClient } from "@supabase/supabase-js";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SA_JSON))
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post("/signed-upload", async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")?.[1];
    if (!idToken) return res.status(401).json({ error: "no token" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const { eventId, filename } = req.body;
    if (!eventId || !filename) return res.status(400).json({ error: "missing" });

    const cleanName = filename.replace(/\s+/g, "_");
    const path = `evento-imagens/${uid}/${eventId}/${Date.now()}_${cleanName}`;

    const { data, error } = await supabase
      .storage
      .from("evento-imagens")
      .createSignedUploadUrl(path, 2 * 60 * 60);

    if (error) throw error;

    return res.json({ uploadUrl: data.signedUploadUrl, path });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

export default app;
