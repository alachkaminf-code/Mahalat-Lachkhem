import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category_id, brand_id, featured, best_seller, has_discount, search, sort } = req.query;
      let query = supabase.from('products').select('*');

      if (category_id) query = query.eq('category_id', category_id);
      if (brand_id) query = query.eq('brand_id', brand_id);
      if (featured === 'true') query = query.eq('featured', true);
      if (best_seller === 'true') query = query.eq('best_seller', true);
      if (has_discount === 'true') query = query.not('discount_price', 'is', null).gt('discount_price', 0);
      if (search) {
        // PostgREST's filter syntax treats , ( ) as control characters and
        // % _ as ILIKE wildcards. Escape/strip them so user input can't
        // break out of the intended filter or inject extra conditions.
        const safeSearch = String(search)
          .replace(/[,()]/g, '')
          .replace(/[%_]/g, '\\$&');
        query = query.or(`name_ar.ilike.%${safeSearch}%,name_en.ilike.%${safeSearch}%`);
      }

      if (sort === 'price_low') query = query.order('price', { ascending: true });
      else if (sort === 'price_high') query = query.order('price', { ascending: false });
      else if (sort === 'discount') query = query.order('discount_price', { ascending: false, nullsFirst: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const { data: { user }, error: ue } = await supabase.auth.getUser(token);
      if (ue || !user) return res.status(401).json({ error: 'Invalid token' });

      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' });

      const body = req.body;
      const { data, error } = await supabase.from('products').insert({
        name_ar: body.name_ar,
        name_en: body.name_en,
        description_ar: body.description_ar,
        description_en: body.description_en,
        price: body.price,
        discount_price: body.discount_price || null,
        category_id: body.category_id,
        brand_id: body.brand_id,
        stock: body.stock || 0,
        image_url: body.image_url,
        gallery: body.gallery || [],
        featured: body.featured || false,
        best_seller: body.best_seller || false,
        specifications: body.specifications || {},
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const { data: { user }, error: ue } = await supabase.auth.getUser(token);
      if (ue || !user) return res.status(401).json({ error: 'Invalid token' });
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' });

      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const { data: { user }, error: ue } = await supabase.auth.getUser(token);
      if (ue || !user) return res.status(401).json({ error: 'Invalid token' });
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' });

      const { id } = req.body;
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
