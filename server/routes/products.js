import express from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(
          id,
          name,
          slug
        ),
        product_images(
          id,
          image_url,
          is_primary,
          display_order
        )
      `, { count: 'exact' })
      .eq('is_active', true);

    // Category filter
    if (category) {
      const { data: cat } = await supabaseAdmin
        .from('categories')
        .select('id')
        .or(`slug.eq.${category},name.ilike.${category}`)
        .single();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    // Search
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    let products = data || [];

    // Sort
    switch (sort) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;

      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;

      case 'newest':
        products.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    // Convert to frontend format
    const formattedProducts = products.map(product => {
      const primaryImage =
        product.product_images?.find(i => i.is_primary) ||
        product.product_images?.sort(
          (a, b) => a.display_order - b.display_order
        )[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.categories?.name || '',
        description: product.description,
        shortDescription: product.short_description,
        price: product.price,
        comparePrice: product.compare_price,
        stock: product.stock_quantity,
        sku: product.sku,
        rating: product.rating,
        reviews: product.review_count,
        image: primaryImage
          ? primaryImage.image_url
          : '/placeholder.jpg',
        images: product.product_images || []
      };
    });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const paginatedProducts = formattedProducts.slice(
      (pageNum - 1) * limitNum,
      pageNum * limitNum
    );
    res.json({
      success: true,
      products: paginatedProducts,
      total: count || formattedProducts.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || formattedProducts.length) / limitNum)
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(
          id,
          name,
          slug
        ),
        product_images(
          id,
          image_url,
          is_primary,
          display_order,
          alt_text
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const primaryImage =
      data.product_images?.find(i => i.is_primary) ||
      data.product_images?.sort(
        (a, b) => a.display_order - b.display_order
      )[0];

    const product = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      category: data.categories?.name || '',
      description: data.description,
      shortDescription: data.short_description,
      price: data.price,
      comparePrice: data.compare_price,
      stock: data.stock_quantity,
      sku: data.sku,
      rating: data.rating,
      reviews: data.review_count,
      image: primaryImage
        ? primaryImage.image_url
        : '/placeholder.jpg',
      images: data.product_images || []
    };

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product'
    });
  }
});

export default router;