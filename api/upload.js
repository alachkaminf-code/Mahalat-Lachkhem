import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) return res.status(401).json({ error: 'Invalid token' });

      const { fileName, fileBase64, contentType } = req.body;
      const buffer = Buffer.from(fileBase64, 'base64');
      const path = `${user.id}/${Date.now()}-${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, buffer, { contentType, upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      return res.status(200).json({ url: urlData.publicUrl });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
