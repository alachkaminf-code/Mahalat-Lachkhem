import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { product_id } = req.query;
      let query = supabase.from('reviews').select('*');
      if (product_id) query = query.eq('product_id', product_id);
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) return res.status(401).json({ error: 'Invalid token' });
      const { product_id, rating, comment } = req.body;
      if (!product_id) return res.status(400).json({ error: 'product_id is required' });
      const numericRating = Number(rating);
      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
      }
      if (typeof comment !== 'string' || comment.trim().length === 0) {
        return res.status(400).json({ error: 'comment is required' });
      }
      const { data, error } = await supabase.from('reviews').insert({
        product_id, rating: numericRating, comment: comment.trim(), user_id: user.id, user_name: user.email,
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
