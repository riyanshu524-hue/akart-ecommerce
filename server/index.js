import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import storeRouter from './routes/store.js';
import paymentsRouter from './routes/payments.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import addressesRouter from './routes/addresses.js';
import vendorsRouter from './routes/vendors.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/store', storeRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/admin', adminRouter);

// Serve static files
app.use(express.static('client/public'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(new URL('../client/public/index.html', import.meta.url).pathname);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
