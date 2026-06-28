/**
 * Authentication Routes
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin as supabase } from '../supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const { data: user, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Store user in database
    await supabase.from('users').insert({
      auth_id: user.user.id,
      email,
      name,
      role: 'user',
    });

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user.id, email }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      success: true,
      token,
      user: { id: user.user.id, email, name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    // Generate JWT token
    const token = jwt.sign(
      { user_id: data.user.id, email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', decoded.user_id)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, email } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ name, phone, email, updated_at: new Date() })
      .eq('auth_id', decoded.user_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout (client-side only, but included for completeness)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
