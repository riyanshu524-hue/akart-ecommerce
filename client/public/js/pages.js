// Page Templates
const Pages = {
  createHeader(title) {
    return `
      <div class="page-header" style="background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)); color: white; padding: 2rem 0;">
        <div class="container">
          <h1>${title}</h1>
        </div>
      </div>
    `;
  },

  createNavbar() {
    const loginBtn = Auth.isAuthenticated ? `
      <div class="flex-center gap-2">
        <span>👤 ${Auth.user?.name || 'User'}</span>
        <button class="btn btn-sm btn-outline" onclick="Auth.logout()">Logout</button>
      </div>
    ` : `
      <div class="flex-center gap-2">
        <a href="/login" class="btn btn-sm">🔐 Login</a>
        <a href="/register" class="btn btn-sm btn-primary">✍️ Register</a>
      </div>
    `;

    return `
      <nav class="navbar" style="background: white; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 100;">
        <div class="container flex-between" style="padding: 1rem 0;">
          <div class="flex-center gap-4">
            <a href="/" class="text-hero" style="font-size: 1.5rem; font-weight: 800; color: var(--brand-primary); text-decoration: none;">
              Akart
            </a>
            <input type="search" class="input" placeholder="Search products..." style="width: 300px;" onkeypress="if(event.key==='Enter') Utils.navigate('/products?search=' + encodeURIComponent(this.value))">
          </div>
          <div class="flex-center gap-4">
            <a href="/wishlist" class="btn btn-sm">❤️ Wishlist</a>
            <a href="/cart" class="btn btn-sm">🛒 Cart</a>
            <button class="btn btn-sm" onclick="Theme.toggle()">🌙</button>
            ${loginBtn}
          </div>
        </div>
      </nav>
    `;
  },

  createFooter() {
    return `
      <footer class="footer" style="background: var(--bg-secondary); margin-top: 4rem; padding: 2rem 0; border-top: 1px solid var(--border-color);">
        <div class="container">
          <div class="grid-3 mb-6">
            <div>
              <h4 class="mb-3">About Akart</h4>
              <ul style="list-style: none;">
                <li><a href="/privacy" style="color: var(--text-muted); text-decoration: none;">About Us</a></li>
                <li><a href="/terms" style="color: var(--text-muted); text-decoration: none;">Careers</a></li>
                <li><a href="/terms" style="color: var(--text-muted); text-decoration: none;">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 class="mb-3">Customer Service</h4>
              <ul style="list-style: none;">
                <li><a href="/terms" style="color: var(--text-muted); text-decoration: none;">Contact Us</a></li>
                <li><a href="/terms" style="color: var(--text-muted); text-decoration: none;">FAQ</a></li>
                <li><a href="/shipping-policy" style="color: var(--text-muted); text-decoration: none;">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 class="mb-3">Legal</h4>
              <ul style="list-style: none;">
                <li><a href="/terms" style="color: var(--text-muted); text-decoration: none;">Terms & Conditions</a></li>
                <li><a href="/privacy" style="color: var(--text-muted); text-decoration: none;">Privacy Policy</a></li>
                <li><a href="/return-policy" style="color: var(--text-muted); text-decoration: none;">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div class="text-center text-muted border-top pt-4">
            <p>&copy; 2026 Akart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  },

  home() {
    return `
      ${this.createNavbar()}
      
      <section class="hero gradient-primary" style="padding: 4rem 0; color: white;">
        <div class="container">
          <div class="grid-2" style="align-items: center;">
            <div>
              <h1 class="text-hero" style="color: white; margin-bottom: 1rem;">Welcome to Akart</h1>
              <p class="text-large" style="margin-bottom: 2rem; opacity: 0.9;">Discover millions of products from trusted sellers. Fast delivery, secure payments, and hassle-free returns.</p>
              <button class="btn btn-lg" style="background-color: white; color: var(--brand-primary);" onclick="Auth.requireLogin() && Utils.navigate('/products')">
                Start Shopping
              </button>
            </div>
            <div style="text-align: center; font-size: 5rem;">🛍️</div>
          </div>
        </div>
      </section>

      <section class="container mb-8">
        <h2 class="mb-4">Categories</h2>
        <div class="grid-6" id="categoriesContainer">
          <p>Loading categories...</p>
        </div>
      </section>

      <section class="container mb-8">
        <h2 class="mb-4">Featured Products</h2>
        <div class="grid-4" id="productsContainer">
          <p>Loading products...</p>
        </div>
      </section>

      ${this.createFooter()}
    `;
  },

  login() {
    return `
      ${this.createNavbar()}
      <div class="container" style="max-width: 400px; margin: 4rem auto;">
        <div class="card">
          <h1 class="mb-6 text-center">Login to Akart</h1>
          <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="mb-4">
              <label class="label">Email Address</label>
              <input type="email" class="input" id="email" required>
            </div>
            <div class="mb-4">
              <label class="label">Password</label>
              <input type="password" class="input" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block mb-4">Login</button>
            <p class="text-center">Don't have an account? <a href="/register" style="color: var(--brand-primary); text-decoration: none;">Register here</a></p>
          </form>
        </div>
      </div>
      ${this.createFooter()}
    `;
  },

  register() {
    return `
      ${this.createNavbar()}
      <div class="container" style="max-width: 400px; margin: 4rem auto;">
        <div class="card">
          <h1 class="mb-6 text-center">Create Account</h1>
          <form id="registerForm" onsubmit="handleRegister(event)">
            <div class="mb-4">
              <label class="label">Full Name</label>
              <input type="text" class="input" id="name" required>
            </div>
            <div class="mb-4">
              <label class="label">Email Address</label>
              <input type="email" class="input" id="email" required>
            </div>
            <div class="mb-4">
              <label class="label">Password</label>
              <input type="password" class="input" id="password" required>
            </div>
            <div class="mb-4">
              <label class="label">Confirm Password</label>
              <input type="password" class="input" id="confirmPassword" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block mb-4">Create Account</button>
            <p class="text-center">Already have an account? <a href="/login" style="color: var(--brand-primary); text-decoration: none;">Login here</a></p>
          </form>
        </div>
      </div>
      ${this.createFooter()}
    `;
  },

  products() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Products')}
      
      <div class="container mb-8">
        <div class="grid-4-1">
          <aside class="card" style="height: fit-content; position: sticky; top: 100px;">
            <h3 class="mb-4">Filters</h3>
            <div class="mb-4">
              <label class="label">Category</label>
              <select class="input" id="categoryFilter" onchange="filterProducts()">
                <option value="">All Categories</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="label">Price Range</label>
              <input type="range" class="input" id="priceFilter" min="0" max="100000" step="1000" onchange="filterProducts()">
              <p id="priceDisplay">₹0 - ₹100000</p>
            </div>
          </aside>

          <div>
            <div class="mb-4 flex-between">
              <h2>All Products</h2>
              <select class="input" style="width: auto;" id="sortFilter" onchange="filterProducts()">
                <option value="created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div class="grid-3" id="productsGrid">
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  cart() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Shopping Cart')}
      
      <div class="container mb-8">
        <div class="grid-3-1">
          <div id="cartItems">
            <p>Loading cart...</p>
          </div>
          <div class="card">
            <h3 class="mb-4">Order Summary</h3>
            <div class="mb-3 flex-between">
              <span>Subtotal</span>
              <span id="subtotal">₹0</span>
            </div>
            <div class="mb-3 flex-between">
              <span>Shipping</span>
              <span id="shipping">₹0</span>
            </div>
            <div class="mb-3 flex-between" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <strong>Total</strong>
              <strong id="total" style="font-size: 1.2rem;">₹0</strong>
            </div>
            <button class="btn btn-primary btn-block" onclick="Auth.requireLogin() && Utils.navigate('/checkout')">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  checkout() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Checkout')}
      
      <div class="container mb-8">
        <div class="grid-2">
          <div>
            <div class="card mb-4">
              <h3 class="mb-4">1. Delivery Address</h3>
              <form id="addressForm">
                <div class="mb-3">
                  <label class="label">Full Name</label>
                  <input type="text" class="input" required>
                </div>
                <div class="mb-3">
                  <label class="label">Phone Number</label>
                  <input type="tel" class="input" required>
                </div>
                <div class="mb-3">
                  <label class="label">Address</label>
                  <textarea class="input" rows="3" required></textarea>
                </div>
                <div class="grid-2 gap-2">
                  <input type="text" class="input" placeholder="City" required>
                  <input type="text" class="input" placeholder="Postal Code" required>
                </div>
              </form>
            </div>

            <div class="card mb-4">
              <h3 class="mb-4">2. Shipping Method</h3>
              <label class="mb-3">
                <input type="radio" name="shipping" value="standard" checked> Standard Delivery (₹50) - 5-7 days
              </label>
              <label>
                <input type="radio" name="shipping" value="express"> Express Delivery (₹200) - 2-3 days
              </label>
            </div>

            <div class="card">
              <h3 class="mb-4">3. Payment Method</h3>
              <div class="mb-3">
                <label class="mb-3">
                  <input type="radio" name="payment" value="upi" checked> UPI
                </label>
                <label class="mb-3">
                  <input type="radio" name="payment" value="netbanking"> Net Banking
                </label>
                <label class="mb-3">
                  <input type="radio" name="payment" value="card"> Credit/Debit Card
                </label>
                <label>
                  <input type="radio" name="payment" value="wallet"> Wallet
                </label>
              </div>
              <button class="btn btn-primary btn-block" onclick="processPayment()">
                Pay Now
              </button>
            </div>
          </div>

          <div class="card" style="height: fit-content;">
            <h3 class="mb-4">Order Summary</h3>
            <div id="checkoutSummary">
              <p>Loading summary...</p>
            </div>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  notFound() {
    return `
      ${this.createNavbar()}
      <div class="container mb-8" style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 5rem; margin-bottom: 1rem;">404</h1>
        <h2 style="margin-bottom: 1rem;">Page Not Found</h2>
        <p style="margin-bottom: 2rem; color: var(--text-muted);">The page you're looking for doesn't exist.</p>
        <a href="/" class="btn btn-primary">Go to Home</a>
      </div>
      ${this.createFooter()}
    `;
  },
};

window.Pages = Pages;

  productDetail(productId) {
    return `
      ${this.createNavbar()}
      
      <div class="container mb-8" style="margin-top: 2rem;">
        <div class="grid-2 gap-4">
          <!-- Image Gallery -->
          <div>
            <div class="card" style="background: var(--bg-secondary); height: 400px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <div style="font-size: 5rem;">📦</div>
            </div>
            <div class="grid-4 gap-2">
              <div class="card" style="background: var(--bg-secondary); height: 80px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 2rem;">📦</span>
              </div>
              <div class="card" style="background: var(--bg-secondary); height: 80px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 2rem;">📦</span>
              </div>
              <div class="card" style="background: var(--bg-secondary); height: 80px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 2rem;">📦</span>
              </div>
              <div class="card" style="background: var(--bg-secondary); height: 80px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 2rem;">📦</span>
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div>
            <h1 id="productName">Product Name</h1>
            <div class="mb-3">
              <span style="font-size: 1.2rem;">⭐⭐⭐⭐⭐ (245 reviews)</span>
              <p style="color: var(--text-muted); margin-top: 0.5rem;">In Stock</p>
            </div>

            <div class="card mb-4">
              <h2 id="productPrice" style="color: var(--brand-primary); font-size: 2rem;">₹999</h2>
              <p style="color: var(--text-muted); text-decoration: line-through;">₹1,299</p>
              <p style="color: var(--success); font-weight: bold;">Save 23%</p>
            </div>

            <div class="card mb-4">
              <h3 class="mb-3">Select Variant</h3>
              <div class="mb-3">
                <label class="label">Size</label>
                <div class="flex-center gap-2">
                  <button class="btn btn-outline">S</button>
                  <button class="btn btn-outline">M</button>
                  <button class="btn btn-primary">L</button>
                  <button class="btn btn-outline">XL</button>
                </div>
              </div>
              <div class="mb-3">
                <label class="label">Color</label>
                <div class="flex-center gap-2">
                  <button class="btn btn-outline" style="background: #000; color: white;">Black</button>
                  <button class="btn btn-primary" style="background: #fff; color: #000; border: 2px solid var(--brand-primary);">White</button>
                  <button class="btn btn-outline" style="background: #0066cc; color: white;">Blue</button>
                </div>
              </div>
            </div>

            <div class="card mb-4">
              <h3 class="mb-3">Quantity</h3>
              <div class="flex-center gap-2" style="width: fit-content;">
                <button class="btn btn-outline">−</button>
                <input type="number" class="input" value="1" style="width: 60px; text-align: center;">
                <button class="btn btn-outline">+</button>
              </div>
            </div>

            <div class="grid-2 gap-2 mb-4">
              <button class="btn btn-lg btn-outline" onclick="addToWishlist(${productId})">❤️ Wishlist</button>
              <button class="btn btn-lg btn-primary" onclick="addToCart(${productId}); Utils.showToast('Added to cart!'); setTimeout(() => Utils.navigate('/cart'), 1000);">🛒 Add to Cart</button>
            </div>

            <div class="card">
              <h3 class="mb-3">Seller Information</h3>
              <div class="flex-between mb-3">
                <div>
                  <h4>TechHub Store</h4>
                  <p style="color: var(--text-muted);">⭐ 4.8 (1,250 reviews)</p>
                </div>
                <button class="btn btn-sm">Visit Store</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Description & Reviews -->
        <div class="grid-3-1 gap-4 mt-8">
          <div>
            <div class="card mb-4">
              <h3 class="mb-3">Product Description</h3>
              <p>High-quality product with excellent features. Perfect for everyday use. Durable and long-lasting. Comes with 1-year warranty.</p>
            </div>

            <div class="card mb-4">
              <h3 class="mb-3">Specifications</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.5rem 0;">Brand</td>
                  <td style="padding: 0.5rem 0;">TechBrand</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.5rem 0;">Model</td>
                  <td style="padding: 0.5rem 0;">TB-2024</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.5rem 0;">Warranty</td>
                  <td style="padding: 0.5rem 0;">1 Year</td>
                </tr>
                <tr>
                  <td style="padding: 0.5rem 0;">Delivery</td>
                  <td style="padding: 0.5rem 0;">2-3 Days</td>
                </tr>
              </table>
            </div>

            <div class="card">
              <h3 class="mb-4">Customer Reviews</h3>
              <div class="mb-4" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div class="flex-between mb-2">
                  <strong>Rahul Kumar</strong>
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Verified Purchase</p>
                <p>Excellent product! Exactly as described. Fast delivery and great customer service.</p>
              </div>
              <div class="mb-4" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div class="flex-between mb-2">
                  <strong>Priya Singh</strong>
                  <span>⭐⭐⭐⭐</span>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Verified Purchase</p>
                <p>Good quality. Minor packaging issue but product is perfect.</p>
              </div>
            </div>
          </div>

          <!-- Related Products -->
          <div>
            <div class="card">
              <h3 class="mb-4">Related Products</h3>
              <div class="flex-col gap-3">
                <div class="card" style="padding: 1rem; cursor: pointer;">
                  <div style="background: var(--bg-secondary); height: 100px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 2rem;">📦</span>
                  </div>
                  <h4 style="margin: 0.5rem 0;">Related Product 1</h4>
                  <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0;">₹899</p>
                  <button class="btn btn-sm btn-primary" onclick="addToCart(1)">Add</button>
                </div>
                <div class="card" style="padding: 1rem; cursor: pointer;">
                  <div style="background: var(--bg-secondary); height: 100px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 2rem;">📦</span>
                  </div>
                  <h4 style="margin: 0.5rem 0;">Related Product 2</h4>
                  <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0;">₹1,099</p>
                  <button class="btn btn-sm btn-primary" onclick="addToCart(2)">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  wishlist() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('My Wishlist')}
      
      <div class="container mb-8">
        <div class="grid-4" id="wishlistGrid">
          <p>Your wishlist is empty. <a href="/products" style="color: var(--brand-primary);">Continue shopping</a></p>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  profile() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('My Profile')}
      
      <div class="container mb-8">
        <div class="grid-4-1">
          <aside class="card" style="height: fit-content;">
            <h3 class="mb-4">Menu</h3>
            <ul style="list-style: none;">
              <li class="mb-2"><a href="#profile" style="color: var(--brand-primary); text-decoration: none;">👤 Profile</a></li>
              <li class="mb-2"><a href="#addresses" style="color: var(--text-muted); text-decoration: none;">📍 Addresses</a></li>
              <li class="mb-2"><a href="#payments" style="color: var(--text-muted); text-decoration: none;">💳 Payment Methods</a></li>
              <li class="mb-2"><a href="#settings" style="color: var(--text-muted); text-decoration: none;">⚙️ Settings</a></li>
            </ul>
          </aside>

          <div>
            <div class="card mb-4">
              <h2 class="mb-4">Profile Information</h2>
              <div class="mb-3">
                <label class="label">Full Name</label>
                <input type="text" class="input" value="John Doe">
              </div>
              <div class="mb-3">
                <label class="label">Email Address</label>
                <input type="email" class="input" value="john@example.com">
              </div>
              <div class="mb-3">
                <label class="label">Phone Number</label>
                <input type="tel" class="input" value="+91 9876543210">
              </div>
              <button class="btn btn-primary">Save Changes</button>
            </div>

            <div class="card">
              <h3 class="mb-4">Change Password</h3>
              <div class="mb-3">
                <label class="label">Current Password</label>
                <input type="password" class="input">
              </div>
              <div class="mb-3">
                <label class="label">New Password</label>
                <input type="password" class="input">
              </div>
              <div class="mb-3">
                <label class="label">Confirm Password</label>
                <input type="password" class="input">
              </div>
              <button class="btn btn-primary">Update Password</button>
            </div>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },
};

  orders() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('My Orders')}
      
      <div class="container mb-8">
        <div id="ordersContainer">
          <p>Loading orders...</p>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  vendor() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Vendor Dashboard')}
      
      <div class="container mb-8">
        <div class="grid-4 gap-4 mb-8">
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Total Sales</h4>
            <h2 style="color: var(--brand-primary); margin: 0;">₹2,50,000</h2>
            <p style="color: var(--success); margin: 0.5rem 0 0 0;">↑ 12% this month</p>
          </div>
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Total Orders</h4>
            <h2 style="color: var(--brand-primary); margin: 0;">145</h2>
            <p style="color: var(--success); margin: 0.5rem 0 0 0;">↑ 8 this week</p>
          </div>
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Pending Orders</h4>
            <h2 style="color: var(--warning); margin: 0;">23</h2>
            <p style="color: var(--warning); margin: 0.5rem 0 0 0;">Action needed</p>
          </div>
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Earnings</h4>
            <h2 style="color: var(--success); margin: 0;">₹2,12,500</h2>
            <p style="color: var(--text-muted); margin: 0.5rem 0 0 0;">After commission</p>
          </div>
        </div>

        <div class="grid-2 gap-4">
          <div class="card">
            <h3 class="mb-4">Recent Orders</h3>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div class="flex-between mb-2">
                <strong>ORD-001</strong>
                <span style="background: var(--success); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem;">Shipped</span>
              </div>
              <p style="color: var(--text-muted); margin: 0;">₹5,000 • 2 items</p>
            </div>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div class="flex-between mb-2">
                <strong>ORD-002</strong>
                <span style="background: var(--warning); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem;">Processing</span>
              </div>
              <p style="color: var(--text-muted); margin: 0;">₹3,500 • 1 item</p>
            </div>
          </div>

          <div class="card">
            <h3 class="mb-4">Quick Actions</h3>
            <button class="btn btn-block btn-primary mb-2">➕ Add Product</button>
            <button class="btn btn-block btn-outline mb-2">📦 Manage Inventory</button>
            <button class="btn btn-block btn-outline mb-2">📊 View Analytics</button>
            <button class="btn btn-block btn-outline">⚙️ Settings</button>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },

  admin() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Admin Dashboard')}
      
      <div class="container mb-8">
        <div class="grid-4 gap-4 mb-8">
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Total Revenue</h4>
            <h2 style="color: var(--brand-primary); margin: 0;">₹25,00,000</h2>
            <p style="color: var(--success); margin: 0.5rem 0 0 0;">↑ 15% this month</p>
          </div>
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Total Users</h4>
            <h2 style="color: var(--brand-primary); margin: 0;">1,250</h2>
            <p style="color: var(--success); margin: 0.5rem 0 0 0;">↑ 45 this week</p>
          </div>
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Active Vendors</h4>
            <h2 style="color: var(--brand-primary); margin: 0;">87</h2>
            <p style="color: var(--warning); margin: 0.5rem 0 0 0;">5 pending approval</p>
          </div>
          <div class="card">
            <h4 style="color: var(--text-muted); margin: 0 0 0.5rem 0;">Total Orders</h4>
            <h2 style="color: var(--brand-primary); margin: 0;">3,450</h2>
            <p style="color: var(--success); margin: 0.5rem 0 0 0;">↑ 120 this week</p>
          </div>
        </div>

        <div class="grid-2 gap-4">
          <div class="card">
            <h3 class="mb-4">Management</h3>
            <button class="btn btn-block btn-outline mb-2">👥 Manage Users</button>
            <button class="btn btn-block btn-outline mb-2">🏪 Manage Vendors</button>
            <button class="btn btn-block btn-outline mb-2">📦 Manage Products</button>
            <button class="btn btn-block btn-outline mb-2">📋 Manage Orders</button>
            <button class="btn btn-block btn-outline mb-2">💰 Commission Settings</button>
            <button class="btn btn-block btn-outline">⚙️ Store Settings</button>
          </div>

          <div class="card">
            <h3 class="mb-4">Recent Activity</h3>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <p style="margin: 0; font-size: 0.9rem;">New vendor registered: TechHub Store</p>
              <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.8rem;">2 hours ago</p>
            </div>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <p style="margin: 0; font-size: 0.9rem;">Order #ORD-5000 completed</p>
              <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.8rem;">5 hours ago</p>
            </div>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <p style="margin: 0; font-size: 0.9rem;">New user registered: Rahul Kumar</p>
              <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.8rem;">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  },
};
