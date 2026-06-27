/**
 * Store Settings Routes
 */

import express from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = express.Router();

/**
 * GET /api/store/settings - Get store settings
 */
router.get('/settings', async (req, res) => {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();

    if (error) {
      // Return default settings if not found
      return res.json({
        store_name: 'Akart',
        store_tagline: 'Shop Everything',
        primary_color: '#2563eb',
        secondary_color: '#f59e0b',
        accent_color: '#8b5cf6',
        currency: 'INR',
        currency_symbol: '₹',
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching store settings:', error);
    res.status(500).json({ error: 'Failed to fetch store settings' });
  }
});

/**
 * GET /api/store/info - Get public store info
 */
router.get('/info', async (req, res) => {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('store_settings')
      .select('store_name, store_tagline, store_logo_url, primary_color, secondary_color')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();

    if (error) {
      return res.json({
        store_name: 'Akart',
        store_tagline: 'Shop Everything',
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching store info:', error);
    res.status(500).json({ error: 'Failed to fetch store info' });
  }
});

export default router;
