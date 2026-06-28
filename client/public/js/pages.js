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
