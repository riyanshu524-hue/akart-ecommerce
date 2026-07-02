import express from 'express';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ======================================================
// Environment Variables
// ======================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'akart-secret-key-2026';

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is missing');
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
}

if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is missing');
}

// ======================================================
// Supabase Clients
// ======================================================

// Admin Client (Database Operations)
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// Public Auth Client (Login)
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ======================================================
// REGISTER
// ======================================================

router.post('/register', async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create Auth User
    const {
      data: authData,
      error: authError
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error(authError);

      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Create Profile
    const {
      data: profile,
      error: profileError
    } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {

      console.error(profileError);

      // Rollback auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return res.status(500).json({
        success: false,
        error: 'Failed to create profile'
      });
    }

    const token = jwt.sign(
      {
        userId: profile.id,
        email: profile.email
      },
      JWT_SECRET,
      {
        expiresIn: '30d'
      }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email
      }
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Registration failed'
    });

  }
});
// ======================================================
// LOGIN
// ======================================================

router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Authenticate with Supabase Auth
    const {
      data: authData,
      error: authError
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user profile
    const {
      data: profile,
      error: profileError
    } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const token = jwt.sign(
      {
        userId: profile.id,
        email: profile.email
      },
      JWT_SECRET,
      {
        expiresIn: '30d'
      }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});
// ======================================================
// LOGOUT
// ======================================================

router.post('/logout', async (req, res) => {
  try {
    // Client removes its own JWT.
    // No server-side session to destroy.

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// ======================================================
// VERIFY TOKEN
// ======================================================

router.get('/verify', async (req, res) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header missing'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Token verification failed'
    });
  }
});

export default router;