/**
 * Product Routes - GET products, search, filter, etc.
 */

import express from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = express.Router();

/**
 * GET /api/products - Get all products with filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      minPrice, 
      maxPrice,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    let query = supabaseAdmin
      .from('products')
      .select('*, product_images(*), vendor:vendors(store_name)', { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (minPrice) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }

    // Apply sorting
    const validSortFields = ['created_at', 'price', 'rating', 'review_count'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? false : true;

    query = query.order(sortField, { ascending: !sortOrder });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    res.json({
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:id - Get single product details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*), product_variants(*), vendor:vendors(store_name, store_logo_url), reviews(*)')
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * GET /api/products/:id/related - Get related products
 */
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the product to find its category
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('category_id')
      .eq('id', id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get related products from same category
    const { data: relatedProducts, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*)')
      .eq('category_id', product.category_id)
      .neq('id', id)
      .eq('is_active', true)
      .limit(6);

    if (error) throw error;

    res.json({ products: relatedProducts });
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
});

/**
 * GET /api/products/search - Search products
 */
router.get('/search/query', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({ products: [] });
    }

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, product_images(*)')
      .ilike('name', `%${q}%`)
      .eq('is_active', true)
      .limit(limit);

    if (error) throw error;

    res.json({ products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

export default router;
