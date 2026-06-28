import express from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin as supabase } from '../supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get user's addresses
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: addresses } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', decoded.user_id);

    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create address
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, address, city, state, pincode } = req.body;

    const { data: newAddress, error } = await supabase
      .from('addresses')
      .insert({
        user_id: decoded.user_id,
        name,
        phone,
        address,
        city,
        state,
        pincode,
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update address
router.put('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, address, city, state, pincode } = req.body;

    const { data: updated, error } = await supabase
      .from('addresses')
      .update({ name, phone, address, city, state, pincode })
      .eq('id', req.params.id)
      .eq('user_id', decoded.user_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, address: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete address
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    await supabase
      .from('addresses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', decoded.user_id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
