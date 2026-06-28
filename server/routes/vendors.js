import express from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin as supabase } from '../supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { data: vendors } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_approved', true);

    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor details
router.get('/:id', async (req, res) => {
  try {
    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', req.params.id)
      .eq('is_active', true);

    res.json({ vendor, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register as vendor
router.post('/register', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { store_name, description, category } = req.body;

    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert({
        user_id: decoded.user_id,
        store_name,
        description,
        category,
        is_approved: false,
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
