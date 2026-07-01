/**
 * Akart E-Commerce Platform
 * Cloudflare Workers Entry Point
 * Uses Fetch API instead of Express
 */

/**
 * Main request handler for Cloudflare Workers
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (pathname.startsWith('/api/')) {
        // Health check
        if (pathname === '/api/health') {
          return new Response(JSON.stringify({ status: 'ok' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        // Products
        if (pathname === '/api/products' && request.method === 'GET') {
          return handleGetProducts(env, corsHeaders);
        }

        // Categories
        if (pathname === '/api/categories' && request.method === 'GET') {
          return handleGetCategories(env, corsHeaders);
        }

        // Store settings
        if (pathname === '/api/store' && request.method === 'GET') {
          return handleGetStore(env, corsHeaders);
        }

        // Auth - Register
        if (pathname === '/api/auth/register' && request.method === 'POST') {
          return handleRegister(request, env, corsHeaders);
        }

        // Auth - Login
        if (pathname === '/api/auth/login' && request.method === 'POST') {
          return handleLogin(request, env, corsHeaders);
        }

        // Auth - Get user
        if (pathname === '/api/auth/me' && request.method === 'GET') {
          return handleGetUser(request, env, corsHeaders);
        }

        // Auth - Logout
        if (pathname === '/api/auth/logout' && request.method === 'POST') {
          return handleLogout(request, env, corsHeaders);
        }

        // Payments - Create order
        if (pathname === '/api/payments/create-order' && request.method === 'POST') {
          return handleCreatePaymentOrder(request, env, corsHeaders);
        }

        // Payments - Verify
        if (pathname === '/api/payments/verify' && request.method === 'POST') {
          return handleVerifyPayment(request, env, corsHeaders);
        }

        // Orders
        if (pathname === '/api/orders' && request.method === 'GET') {
          return handleGetOrders(request, env, corsHeaders);
        }

        if (pathname === '/api/orders' && request.method === 'POST') {
          return handleCreateOrder(request, env, corsHeaders);
        }

        // Addresses
        if (pathname === '/api/addresses' && request.method === 'GET') {
          return handleGetAddresses(request, env, corsHeaders);
        }

        if (pathname === '/api/addresses' && request.method === 'POST') {
          return handleCreateAddress(request, env, corsHeaders);
        }

        // Vendors
        if (pathname === '/api/vendors' && request.method === 'GET') {
          return handleGetVendors(env, corsHeaders);
        }

        // Admin
        if (pathname === '/api/admin/dashboard' && request.method === 'GET') {
          return handleAdminDashboard(request, env, corsHeaders);
        }
      }

      // Serve static files
      if (pathname === '/' || pathname === '/index.html') {
        return handleStaticFile('index.html', env, corsHeaders);
      }

      // Serve CSS, JS, etc.
      if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/images/')) {
        return handleStaticFile(pathname.substring(1), env, corsHeaders);
      }

      // 404
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

/**
 * Initialize Supabase client
 */
function initSupabase(env) {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}

/**
 * Initialize Supabase admin client
 */
function initSupabaseAdmin(env) {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Handle GET /api/products
 */
async function handleGetProducts(env, corsHeaders) {
  try {
    // For Cloudflare Workers, we'll fetch from a simple in-memory store
    // In production, use Supabase or a database
    const products = [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        category: 'Electronics',
        price: 139999,
        description: 'Latest Apple iPhone with A17 Pro chip, 6.7-inch display, advanced camera system',
        image: '📱',
        stock: 15,
        rating: 4.8,
        reviews: 2341,
        vendor: 'Apple Store',
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Electronics',
        price: 129999,
        description: 'Flagship Android phone with 200MP camera, 6.8-inch AMOLED display',
        image: '📱',
        stock: 20,
        rating: 4.7,
        reviews: 1856,
        vendor: 'Samsung India',
      },
      {
        id: 3,
        name: 'Sony WH-1000XM5 Headphones',
        category: 'Electronics',
        price: 29999,
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery',
        image: '🎧',
        stock: 45,
        rating: 4.9,
        reviews: 5234,
        vendor: 'Sony Electronics',
      },
      {
        id: 4,
        name: 'MacBook Pro 16-inch M3 Max',
        category: 'Electronics',
        price: 249999,
        description: 'Powerful laptop with M3 Max chip, 16GB RAM, 512GB SSD',
        image: '💻',
        stock: 8,
        rating: 4.9,
        reviews: 3421,
        vendor: 'Apple Store',
      },
      {
        id: 5,
        name: 'Nike Air Max 90',
        category: 'Fashion',
        price: 8999,
        description: 'Classic Nike sneakers with Air cushioning technology',
        image: '👟',
        stock: 60,
        rating: 4.6,
        reviews: 4123,
        vendor: 'Nike India',
      },
    ];

    return new Response(JSON.stringify({ success: true, products }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/categories
 */
async function handleGetCategories(env, corsHeaders) {
  try {
    const categories = [
      { id: 1, name: 'Electronics', icon: '📱' },
      { id: 2, name: 'Fashion', icon: '👕' },
      { id: 3, name: 'Home & Kitchen', icon: '🏠' },
      { id: 4, name: 'Books', icon: '📚' },
      { id: 5, name: 'Sports', icon: '⚽' },
      { id: 6, name: 'Beauty', icon: '💄' },
    ];

    return new Response(JSON.stringify({ success: true, categories }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/store
 */
async function handleGetStore(env, corsHeaders) {
  try {
    const store = {
      name: 'Akart',
      tagline: 'Discover millions of products from trusted sellers',
      logo: 'https://via.placeholder.com/200x50?text=Akart',
      primaryColor: '#ff6b35',
      secondaryColor: '#004e89',
      accentColor: '#ffd60a',
    };

    return new Response(JSON.stringify({ success: true, store }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/auth/register
 */
async function handleRegister(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Generate a simple user ID
    const userId = 'user_' + Date.now();

    // Generate JWT token
    const token = generateJWT(userId, email, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      user: { id: userId, email, name: name || email.split('@')[0] },
      token,
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/auth/login
 */
async function handleLogin(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // For demo purposes, accept any email/password combination
    const userId = 'user_' + email.replace(/[^a-z0-9]/gi, '');
    const token = generateJWT(userId, email, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      user: { id: userId, email, name: email.split('@')[0] },
      token,
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/auth/me
 */
async function handleGetUser(request, env, corsHeaders) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));

    return new Response(JSON.stringify({
      success: true,
      user: { id: payload.sub, email: payload.email },
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/auth/logout
 */
async function handleLogout(request, env, corsHeaders) {
  try {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/payments/create-order
 */
async function handleCreatePaymentOrder(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    if (!amount) {
      return new Response(JSON.stringify({ error: 'Missing amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Create Razorpay order via API
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(env.RAZORPAY_KEY_ID + ':' + env.RAZORPAY_KEY_SECRET),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || 'order_' + Date.now(),
      }),
    });

    const razorpayOrder = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      throw new Error(razorpayOrder.error?.description || 'Failed to create Razorpay order');
    }

    return new Response(JSON.stringify({
      success: true,
      id: razorpayOrder.id,
      amount,
      currency,
      keyId: env.RAZORPAY_KEY_ID,
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/payments/verify
 */
async function handleVerifyPayment(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return new Response(JSON.stringify({ error: 'Missing payment details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Verify signature using crypto API
    const body_str = razorpayOrderId + '|' + razorpayPaymentId;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(env.RAZORPAY_KEY_SECRET);
    const messageData = encoder.encode(body_str);

    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const expectedSignature = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (expectedSignature !== razorpaySignature) {
      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Payment verified' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/orders
 */
async function handleGetOrders(request, env, corsHeaders) {
  try {
    const orders = [
      {
        id: 'order_1',
        date: new Date().toISOString(),
        total: 139999,
        status: 'Delivered',
        items: [{ name: 'iPhone 15 Pro Max', price: 139999, quantity: 1 }],
      },
    ];

    return new Response(JSON.stringify({ success: true, orders }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/orders
 */
async function handleCreateOrder(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { items, address, shippingMethod, total } = body;

    if (!items || !address) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const orderId = 'order_' + Date.now();

    return new Response(JSON.stringify({
      success: true,
      order: {
        id: orderId,
        items,
        address,
        shippingMethod,
        total,
        status: 'Pending',
        date: new Date().toISOString(),
      },
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/addresses
 */
async function handleGetAddresses(request, env, corsHeaders) {
  try {
    const addresses = [];

    return new Response(JSON.stringify({ success: true, addresses }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle POST /api/addresses
 */
async function handleCreateAddress(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { name, phone, address, city, state, pincode } = body;

    if (!name || !phone || !address || !city || !state || !pincode) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const addressId = 'addr_' + Date.now();

    return new Response(JSON.stringify({
      success: true,
      address: { id: addressId, name, phone, address, city, state, pincode },
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/vendors
 */
async function handleGetVendors(env, corsHeaders) {
  try {
    const vendors = [
      { id: 1, name: 'Apple Store', rating: 4.9, products: 150 },
      { id: 2, name: 'Samsung India', rating: 4.8, products: 200 },
      { id: 3, name: 'Sony Electronics', rating: 4.7, products: 100 },
    ];

    return new Response(JSON.stringify({ success: true, vendors }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle GET /api/admin/dashboard
 */
async function handleAdminDashboard(request, env, corsHeaders) {
  try {
    const dashboard = {
      totalRevenue: 5000000,
      totalOrders: 1250,
      totalCustomers: 8500,
      totalVendors: 150,
      recentOrders: [],
    };

    return new Response(JSON.stringify({ success: true, dashboard }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Handle static files
 */
async function handleStaticFile(path, env, corsHeaders) {
  try {
    // For Cloudflare Workers, serve from KV or return a simple response
    // In production, use Cloudflare KV to store static files
    return new Response('Static file: ' + path, {
      headers: { ...corsHeaders },
    });
  } catch (error) {
    return new Response('Not found', {
      status: 404,
      headers: { ...corsHeaders },
    });
  }
}

/**
 * Generate JWT token
 */
function generateJWT(userId, email, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  }));

  // For Cloudflare Workers, we'll use a simple signature
  // In production, use proper crypto libraries
  const signature = btoa(header + '.' + payload + '.' + secret);

  return header + '.' + payload + '.' + signature;
}
