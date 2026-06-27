/**
 * Category Routes
 */

import express from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = express.Router();

/**
 * GET /api/categories - Get all categories
 */
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch categories' });
  }
});

/**
 * GET /api/categories/:id - Get category with products
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: category, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (categoryError || !category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get products in this category
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*)')
      .eq('category_id', id)
      .eq('is_active', true)
      .limit(20);

    if (productsError) throw productsError;

    res.json({ category, products: products || [] });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch category' });
  }
});

export default router;
