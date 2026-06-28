import express from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin as supabase } from '../supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const verifyAdmin = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');
  
  const decoded = jwt.verify(token, JWT_SECRET);
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', decoded.user_id)
    .single();
  
  if (user?.role !== 'admin') throw new Error('Forbidden');
  return decoded;
};

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    await verifyAdmin(req);

    const { data: orders } = await supabase
      .from('orders')
      .select('total');

    const { data: users } = await supabase
      .from('users')
      .select('id');

    const { data: vendors } = await supabase
      .from('vendors')
      .select('id');

    const revenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    res.json({
      revenue,
      orders: orders?.length || 0,
      users: users?.length || 0,
      vendors: vendors?.length || 0,
    });
  } catch (error) {
    res.status(error.message === 'Forbidden' ? 403 : 500).json({ error: error.message });
  }
});

// Get all vendors
router.get('/vendors', async (req, res) => {
  try {
    await verifyAdmin(req);
    const { data: vendors } = await supabase.from('vendors').select('*');
    res.json({ vendors });
  } catch (error) {
    res.status(error.message === 'Forbidden' ? 403 : 500).json({ error: error.message });
  }
});

// Approve vendor
router.put('/vendors/:id/approve', async (req, res) => {
  try {
    await verifyAdmin(req);
    const { data: vendor, error } = await supabase
      .from('vendors')
      .update({ is_approved: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, vendor });
  } catch (error) {
    res.status(error.message === 'Forbidden' ? 403 : 500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    await verifyAdmin(req);
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    res.json({ orders });
  } catch (error) {
    res.status(error.message === 'Forbidden' ? 403 : 500).json({ error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    await verifyAdmin(req);
    const { status } = req.body;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, order });
  } catch (error) {
    res.status(error.message === 'Forbidden' ? 403 : 500).json({ error: error.message });
  }
});

export default router;
