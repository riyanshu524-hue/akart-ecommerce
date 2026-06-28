import express from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin as supabase } from '../supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', decoded.user_id)
      .order('created_at', { ascending: false });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details
router.get('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', decoded.user_id)
      .single();

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { items, address_id, shipping_method, payment_method } = req.body;

    // Calculate total
    let total = 0;
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price')
        .eq('id', item.product_id)
        .single();
      total += product.price * item.quantity;
    }

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: decoded.user_id,
        address_id,
        shipping_method,
        payment_method,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Add order items
    for (const item of items) {
      await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
