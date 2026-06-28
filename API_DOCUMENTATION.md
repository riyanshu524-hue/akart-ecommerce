# Akart API Documentation

Complete API reference for the Akart e-commerce platform.

## Base URL

```
https://akart.vercel.app/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Response Format

All responses are in JSON format:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## Products API

### List Products

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category ID
- `sort` (optional): Sort by (newest, price_asc, price_desc, rating)
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Description",
      "price": 999,
      "image": "url",
      "category_id": 1,
      "vendor_id": 1,
      "rating": 4.5,
      "reviews_count": 123
    }
  ],
  "total": 100,
  "page": 1
}
```

### Get Product Details

**Endpoint:** `GET /products/:id`

**Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Product Name",
    "description": "Description",
    "price": 999,
    "images": ["url1", "url2"],
    "variants": [
      {
        "id": 1,
        "name": "Size",
        "options": ["S", "M", "L", "XL"]
      }
    ],
    "reviews": [
      {
        "id": 1,
        "author": "John Doe",
        "rating": 5,
        "comment": "Great product!",
        "date": "2026-06-28"
      }
    ],
    "related_products": [...]
  }
}
```

### Search Products

**Endpoint:** `GET /products/search?q=query`

**Query Parameters:**
- `q`: Search query (required)

**Response:**
```json
{
  "results": [...],
  "total": 10
}
```

---

## Categories API

### List Categories

**Endpoint:** `GET /categories`

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices",
      "image": "url",
      "product_count": 234
    }
  ]
}
```

### Get Category Details

**Endpoint:** `GET /categories/:id`

**Response:**
```json
{
  "category": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices",
    "subcategories": [...],
    "products": [...]
  }
}
```

---

## Authentication API

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login User

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Get User Profile

**Endpoint:** `GET /auth/profile`

**Headers:** Requires authentication

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "role": "user",
    "created_at": "2026-06-28"
  }
}
```

### Update User Profile

**Endpoint:** `PUT /auth/profile`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": {...}
}
```

### Logout

**Endpoint:** `POST /auth/logout`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Orders API

### Get User Orders

**Endpoint:** `GET /orders`

**Headers:** Requires authentication

**Query Parameters:**
- `page` (optional): Page number
- `status` (optional): Filter by status (pending, confirmed, shipped, delivered)

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-001",
      "total": 4999,
      "status": "delivered",
      "created_at": "2026-06-28",
      "items": [
        {
          "product_id": 1,
          "quantity": 1,
          "price": 4999
        }
      ]
    }
  ]
}
```

### Get Order Details

**Endpoint:** `GET /orders/:id`

**Headers:** Requires authentication

**Response:**
```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-001",
    "total": 4999,
    "status": "delivered",
    "shipping_address": {...},
    "items": [...],
    "payment_method": "razorpay",
    "tracking_number": "TRK123456",
    "created_at": "2026-06-28"
  }
}
```

### Create Order

**Endpoint:** `POST /orders`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 4999
    }
  ],
  "address_id": 1,
  "shipping_method": "express",
  "payment_method": "razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "order_number": "ORD-001",
    "total": 4999
  }
}
```

---

## Payments API

### Create Razorpay Order

**Endpoint:** `POST /payments/create-order`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "order_id": 1,
  "amount": 4999,
  "currency": "INR"
}
```

**Response:**
```json
{
  "razorpay_order_id": "order_123456",
  "amount": 499900,
  "currency": "INR"
}
```

### Verify Payment

**Endpoint:** `POST /payments/verify`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "razorpay_order_id": "order_123456",
  "razorpay_payment_id": "pay_123456",
  "razorpay_signature": "signature"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Webhook Handler

**Endpoint:** `POST /payments/webhook`

**Headers:**
- `X-Razorpay-Signature`: Razorpay signature

**Events:**
- `payment.authorized`
- `payment.failed`
- `refund.created`

---

## Addresses API

### Get User Addresses

**Endpoint:** `GET /addresses`

**Headers:** Requires authentication

**Response:**
```json
{
  "addresses": [
    {
      "id": 1,
      "name": "Home",
      "phone": "+91 98765 43210",
      "address": "123 Main Street",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "is_default": true
    }
  ]
}
```

### Create Address

**Endpoint:** `POST /addresses`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "Home",
  "phone": "+91 98765 43210",
  "address": "123 Main Street",
  "city": "New Delhi",
  "state": "Delhi",
  "pincode": "110001"
}
```

**Response:**
```json
{
  "success": true,
  "address": {...}
}
```

### Update Address

**Endpoint:** `PUT /addresses/:id`

**Headers:** Requires authentication

**Request Body:** Same as create

**Response:**
```json
{
  "success": true,
  "address": {...}
}
```

### Delete Address

**Endpoint:** `DELETE /addresses/:id`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true
}
```

---

## Vendors API

### List Vendors

**Endpoint:** `GET /vendors`

**Query Parameters:**
- `page` (optional): Page number
- `category` (optional): Filter by category

**Response:**
```json
{
  "vendors": [
    {
      "id": 1,
      "store_name": "Tech Store",
      "description": "Premium electronics",
      "rating": 4.8,
      "reviews_count": 156,
      "is_approved": true
    }
  ]
}
```

### Get Vendor Details

**Endpoint:** `GET /vendors/:id`

**Response:**
```json
{
  "vendor": {
    "id": 1,
    "store_name": "Tech Store",
    "description": "Premium electronics",
    "rating": 4.8,
    "reviews_count": 156
  },
  "products": [...]
}
```

### Register as Vendor

**Endpoint:** `POST /vendors/register`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "store_name": "My Store",
  "description": "Store description",
  "category": "Electronics"
}
```

**Response:**
```json
{
  "success": true,
  "vendor": {
    "id": 1,
    "store_name": "My Store",
    "is_approved": false
  }
}
```

---

## Admin API

### Get Analytics

**Endpoint:** `GET /admin/analytics`

**Headers:** Requires admin authentication

**Response:**
```json
{
  "revenue": 4567890,
  "orders": 2345,
  "users": 12456,
  "vendors": 156
}
```

### Get All Vendors

**Endpoint:** `GET /admin/vendors`

**Headers:** Requires admin authentication

**Response:**
```json
{
  "vendors": [...]
}
```

### Approve Vendor

**Endpoint:** `PUT /admin/vendors/:id/approve`

**Headers:** Requires admin authentication

**Response:**
```json
{
  "success": true,
  "vendor": {...}
}
```

### Get All Orders

**Endpoint:** `GET /admin/orders`

**Headers:** Requires admin authentication

**Response:**
```json
{
  "orders": [...]
}
```

### Update Order Status

**Endpoint:** `PUT /admin/orders/:id/status`

**Headers:** Requires admin authentication

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response:**
```json
{
  "success": true,
  "order": {...}
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing or invalid authentication token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `SERVER_ERROR` - Internal server error

---

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
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

## Filtering & Sorting

### Filtering

Use query parameters to filter:
```
GET /products?category=1&min_price=100&max_price=1000
```

### Sorting

Use `sort` parameter:
```
GET /products?sort=price_asc
```

Available sorts:
- `newest` - Newest first
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `rating` - Highest rated first
- `popular` - Most popular first

---

## Examples

### Example: Complete Purchase Flow

1. **Register/Login**
```bash
curl -X POST https://akart.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. **Get Products**
```bash
curl https://akart.vercel.app/api/products?category=1&sort=price_asc
```

3. **Create Order**
```bash
curl -X POST https://akart.vercel.app/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": 1, "quantity": 1, "price": 4999}],
    "address_id": 1,
    "shipping_method": "express",
    "payment_method": "razorpay"
  }'
```

4. **Create Razorpay Order**
```bash
curl -X POST https://akart.vercel.app/api/payments/create-order \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"order_id": 1, "amount": 4999, "currency": "INR"}'
```

5. **Verify Payment**
```bash
curl -X POST https://akart.vercel.app/api/payments/verify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_123456",
    "razorpay_payment_id": "pay_123456",
    "razorpay_signature": "signature"
  }'
```

---

**Last Updated:** 2026-06-28
