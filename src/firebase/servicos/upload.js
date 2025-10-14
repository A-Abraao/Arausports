import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const app = express();
const upload = multer();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = process.env.SUPABASE_BUCKET;

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { ownerUid, eventId } = req.body;
    if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });
    if (!ownerUid || !eventId) return res.status(400).json({ error: 'ownerUid e eventId obrigatórios' });

    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.originalname}`;
    const path = `events/${ownerUid}/${eventId}/gallery/${filename}`;

    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file.buffer, { upsert: false });
    if (error) return res.status(500).json({ error });

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return res.json({ path, url: publicData.publicUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

export default app;
