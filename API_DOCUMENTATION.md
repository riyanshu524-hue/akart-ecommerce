# Akart E-Commerce Platform - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check
**GET** `/health`
- Returns server status
- Response: `{ status: "ok", timestamp: "..." }`

### Categories
**GET** `/categories`
- Get all active categories
- Response: `{ categories: [...] }`

**GET** `/categories/:id`
- Get category with products
- Response: `{ category: {...}, products: [...] }`

### Products
**GET** `/products`
- Get products with filtering, sorting, pagination
- Query params: `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `sort`, `order`
- Response: `{ products: [...], pagination: {...} }`

**GET** `/products/:id`
- Get product details with variants and reviews
- Response: `{ product: {...}, variants: [...], reviews: [...] }`

**GET** `/products/:id/related`
- Get related products
- Response: `{ products: [...] }`

### Store Settings
**GET** `/store/info`
- Get store branding information
- Response: `{ store_name, store_tagline, store_logo_url, primary_color, secondary_color }`

**PUT** `/store/info` (Admin only)
- Update store settings
- Body: `{ store_name, store_tagline, primary_color, secondary_color }`

### Payments
**POST** `/payments/create-order`
- Create Razorpay order
- Body: `{ amount, currency, customer_id, order_id }`
- Response: `{ razorpay_order_id, keyId }`

**POST** `/payments/verify`
- Verify payment signature
- Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- Response: `{ success: true, order_id }`

**POST** `/payments/webhook`
- Razorpay webhook endpoint
- Verifies and processes payment events

### Orders
**GET** `/orders` (Protected)
- Get user's orders
- Response: `{ orders: [...] }`

**POST** `/orders` (Protected)
- Create new order
- Body: `{ items: [...], address_id, shipping_method, payment_method }`
- Response: `{ order_id, status, total }`

**GET** `/orders/:id` (Protected)
- Get order details
- Response: `{ order: {...}, items: [...], tracking: {...} }`

### Users
**POST** `/users/register`
- Register new user
- Body: `{ email, password, name }`
- Response: `{ user_id, token }`

**POST** `/users/login`
- Login user
- Body: `{ email, password }`
- Response: `{ user_id, token, user: {...} }`

**GET** `/users/profile` (Protected)
- Get current user profile
- Response: `{ user: {...} }`

**PUT** `/users/profile` (Protected)
- Update user profile
- Body: `{ name, phone, email }`
- Response: `{ user: {...} }`

### Addresses
**GET** `/addresses` (Protected)
- Get user's addresses
- Response: `{ addresses: [...] }`

**POST** `/addresses` (Protected)
- Create new address
- Body: `{ name, phone, address, city, state, pincode }`
- Response: `{ address_id, address: {...} }`

**PUT** `/addresses/:id` (Protected)
- Update address
- Body: `{ name, phone, address, city, state, pincode }`
- Response: `{ address: {...} }`

**DELETE** `/addresses/:id` (Protected)
- Delete address
- Response: `{ success: true }`

### Vendors
**GET** `/vendors`
- Get all approved vendors
- Response: `{ vendors: [...] }`

**GET** `/vendors/:id`
- Get vendor details
- Response: `{ vendor: {...}, products: [...] }`

**POST** `/vendors/register` (Protected)
- Register as vendor
- Body: `{ store_name, description, category }`
- Response: `{ vendor_id, status }`

**GET** `/vendors/dashboard` (Protected - Vendor only)
- Get vendor dashboard data
- Response: `{ sales, orders, earnings, products }`

### Admin
**GET** `/admin/analytics` (Protected - Admin only)
- Get platform analytics
- Response: `{ revenue, orders, users, vendors }`

**GET** `/admin/vendors` (Protected - Admin only)
- Get all vendors (pending and approved)
- Response: `{ vendors: [...] }`

**PUT** `/admin/vendors/:id/approve` (Protected - Admin only)
- Approve vendor
- Response: `{ vendor: {...} }`

**GET** `/admin/orders` (Protected - Admin only)
- Get all orders
- Response: `{ orders: [...] }`

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

Common error codes:
- `INVALID_REQUEST` - Invalid request parameters
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination
List endpoints support pagination:
- `page` (default: 1)
- `limit` (default: 20, max: 100)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Sorting
Supported sort fields:
- `created_at` - Creation date
- `price` - Product price
- `rating` - Product rating
- `name` - Name/Title

Sort order: `asc` or `desc`

Example: `?sort=price&order=asc`

---

## Filtering
Supported filters:
- `category` - Category ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search query
- `status` - Order/Vendor status
- `vendor_id` - Vendor ID

Example: `?category=123&minPrice=100&maxPrice=5000`

---

## Examples

### Get Products with Filters
```bash
curl "http://localhost:3000/api/products?category=electronics&minPrice=1000&maxPrice=50000&sort=price&order=asc&page=1&limit=20"
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "product_id": "123", "quantity": 2 },
      { "product_id": "456", "quantity": 1 }
    ],
    "address_id": "addr-123",
    "shipping_method": "standard",
    "payment_method": "razorpay"
  }'
```

### Verify Payment
```bash
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_123",
    "razorpay_payment_id": "pay_123",
    "razorpay_signature": "signature_123"
  }'
```

---

## Webhooks

### Razorpay Payment Webhook
Endpoint: `POST /api/payments/webhook`

Events:
- `payment.authorized` - Payment successful
- `payment.failed` - Payment failed
- `payment.captured` - Payment captured

---

## Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `JWT_SECRET` - JWT signing secret

---

## Support
For API support, contact: api@akart.com
