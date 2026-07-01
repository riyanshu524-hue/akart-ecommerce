// ============================================
// AKART E-COMMERCE PLATFORM
// Complete Frontend Application
// ============================================

// ============================================
// 1. UTILITIES
// ============================================
const Utils = {
  navigate(path) {
    window.location.hash = path;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  },
  
  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  },
  
  getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  },
  
  formatPrice(price) {
    return '₹' + parseFloat(price).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  },
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

// ============================================
// 2. THEME MANAGER
// ============================================
const Theme = {
  current: localStorage.getItem('theme') || 'light',
  
  init() {
    document.documentElement.setAttribute('data-theme', this.current);
  },
  
  toggle() {
    this.current = this.current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.current);
    document.documentElement.setAttribute('data-theme', this.current);
  }
};

// ============================================
// 3. AUTH MANAGER
// ============================================
const Auth = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        this.user = data.user;
        this.token = data.token;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  
  async register(name, email, password) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (data.success) {
        this.user = data.user;
        this.token = data.token;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  },
  
  logout() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    Utils.navigate('#/');
  },
  
  requireLogin() {
    if (!this.isAuthenticated) {
      Utils.navigate('#/login');
      return false;
    }
    return true;
  }
};

// ============================================
// 4. API CLIENT
// ============================================
const API = {
  baseURL: '/api',
  
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (Auth.token) {
      headers['Authorization'] = `Bearer ${Auth.token}`;
    }
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });
    
    return response.json();
  },
  
  async getProducts(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/products?${query}`);
  },
  
  async getProduct(id) {
    return this.request(`/products/${id}`);
  },
  
  async getCategories() {
    return this.request('/categories');
  },
  
  async getStoreSettings() {
    return this.request('/store/settings');
  },
  
  async createOrder(data) {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(data) });
  },
  
  async createPaymentOrder(data) {
    return this.request('/payments/create-order', { method: 'POST', body: JSON.stringify(data) });
  },
  
  async verifyPayment(data) {
    return this.request('/payments/verify', { method: 'POST', body: JSON.stringify(data) });
  }
};

// ============================================
// 5. CART MANAGER
// ============================================
const Cart = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addItem(product, quantity = 1) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    this.save();
    Utils.showToast('Added to cart!', 'success');
  },
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },
  
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
    }
  },
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  clear() {
    this.items = [];
    this.save();
  },
  
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
};

// ============================================
// 6. PAGE TEMPLATES
// ============================================
const Pages = {
  createNavbar() {
    const loginBtn = Auth.isAuthenticated ? `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span>👤 ${Auth.user?.name || 'User'}</span>
        <button class="btn btn-sm btn-outline" onclick="Auth.logout()">Logout</button>
      </div>
    ` : `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <a href="#/login" class="btn btn-sm">🔐 Login</a>
        <a href="#/register" class="btn btn-sm btn-primary">✍️ Register</a>
      </div>
    `;

    return `
      <nav style="background: white; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <a href="#/" style="font-size: 1.5rem; font-weight: 800; color: #ff6b35; text-decoration: none;">Akart</a>
          <input type="search" id="searchInput" placeholder="Search products..." style="width: 300px; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;" onkeypress="if(event.key==='Enter') Utils.navigate('#/products?search=' + encodeURIComponent(this.value))">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <a href="#/wishlist" class="btn btn-sm">❤️ Wishlist</a>
            <a href="#/cart" class="btn btn-sm">🛒 Cart (${Cart.items.length})</a>
            <button class="btn btn-sm" onclick="Theme.toggle()">🌙</button>
            ${loginBtn}
          </div>
        </div>
      </nav>
    `;
  },

  createFooter() {
    return `
      <footer style="background: #f3f4f6; margin-top: 4rem; padding: 2rem 0; border-top: 1px solid #e5e7eb;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 2rem;">
            <div>
              <h4 style="margin-bottom: 1rem;">About Akart</h4>
              <ul style="list-style: none; padding: 0;">
                <li><a href="#/about" style="color: #666; text-decoration: none; cursor: pointer;">About Us</a></li>
                <li><a href="#/careers" style="color: #666; text-decoration: none; cursor: pointer;">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 style="margin-bottom: 1rem;">Customer Service</h4>
              <ul style="list-style: none; padding: 0;">
                <li><a href="#/contact" style="color: #666; text-decoration: none; cursor: pointer;">Contact Us</a></li>
                <li><a href="#/faq" style="color: #666; text-decoration: none; cursor: pointer;">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 style="margin-bottom: 1rem;">Legal</h4>
              <ul style="list-style: none; padding: 0;">
                <li><a href="#/terms" style="color: #666; text-decoration: none; cursor: pointer;">Terms</a></li>
                <li><a href="#/privacy" style="color: #666; text-decoration: none; cursor: pointer;">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 1rem; color: #666;">
            <p>&copy; 2026 Akart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  },

  home() {
    return `
      ${this.createNavbar()}
      <section style="background: linear-gradient(135deg, #ff6b35, #004e89); color: white; padding: 4rem 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 2rem;">
          <div>
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Welcome to Akart</h1>
            <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;">Discover millions of products from trusted sellers. Fast delivery, secure payments, and hassle-free returns.</p>
            <button class="btn btn-lg" style="background-color: white; color: #ff6b35; cursor: pointer; padding: 0.75rem 1.5rem; border: none; border-radius: 0.25rem; font-weight: 600;" onclick="Auth.requireLogin() ? Utils.navigate('#/products') : Utils.navigate('#/login')">Start Shopping</button>
          </div>
          <div style="text-align: center; font-size: 5rem;">🛍️</div>
        </div>
      </section>
      <section style="max-width: 1200px; margin: 4rem auto; padding: 0 1rem;">
        <h2 style="margin-bottom: 2rem;">Featured Products</h2>
        <div id="featuredProducts" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;">
          <p>Loading products...</p>
        </div>
      </section>
      ${this.createFooter()}
    `;
  },

  login() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 400px; margin: 4rem auto; padding: 0 1rem;">
        <h1 style="text-align: center; margin-bottom: 2rem;">Login</h1>
        <form id="loginForm" onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="email" id="loginEmail" placeholder="Email" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <input type="password" id="loginPassword" placeholder="Password" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <button type="submit" class="btn btn-primary" style="cursor: pointer; padding: 0.75rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600;">Login</button>
        </form>
        <p style="text-align: center; margin-top: 1rem;">Don't have an account? <a href="#/register" style="color: #ff6b35; text-decoration: none; cursor: pointer;">Register here</a></p>
      </div>
      ${this.createFooter()}
    `;
  },

  register() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 400px; margin: 4rem auto; padding: 0 1rem;">
        <h1 style="text-align: center; margin-bottom: 2rem;">Register</h1>
        <form id="registerForm" onsubmit="handleRegister(event)" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="text" id="registerName" placeholder="Full Name" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <input type="email" id="registerEmail" placeholder="Email" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <input type="password" id="registerPassword" placeholder="Password" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <button type="submit" class="btn btn-primary" style="cursor: pointer; padding: 0.75rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600;">Register</button>
        </form>
        <p style="text-align: center; margin-top: 1rem;">Already have an account? <a href="#/login" style="color: #ff6b35; text-decoration: none; cursor: pointer;">Login here</a></p>
      </div>
      ${this.createFooter()}
    `;
  },

  products() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <h1 style="margin-bottom: 2rem;">Products</h1>
        <div id="productsGrid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;">
          <p>Loading products...</p>
        </div>
      </div>
      ${this.createFooter()}
    `;
  },

  cart() {
    let cartHTML = `
      ${this.createNavbar()}
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <h1 style="margin-bottom: 2rem;">Shopping Cart</h1>
    `;

    if (Cart.items.length === 0) {
      cartHTML += `<p style="text-align: center; padding: 2rem;">Your cart is empty. <a href="#/products" style="color: #ff6b35; cursor: pointer;">Continue shopping</a></p>`;
    } else {
      cartHTML += `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 1rem;">Product</th>
              <th style="text-align: center; padding: 1rem;">Quantity</th>
              <th style="text-align: right; padding: 1rem;">Price</th>
              <th style="text-align: right; padding: 1rem;">Total</th>
              <th style="text-align: center; padding: 1rem;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${Cart.items.map(item => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 1rem;">${item.name}</td>
                <td style="text-align: center; padding: 1rem;">
                  <input type="number" value="${item.quantity}" min="1" onchange="Cart.updateQuantity(${item.id}, this.value); location.reload();" style="width: 60px; padding: 0.25rem;">
                </td>
                <td style="text-align: right; padding: 1rem;">${Utils.formatPrice(item.price)}</td>
                <td style="text-align: right; padding: 1rem;">${Utils.formatPrice(item.price * item.quantity)}</td>
                <td style="text-align: center; padding: 1rem;">
                  <button onclick="Cart.removeItem(${item.id}); location.reload();" class="btn btn-sm btn-outline" style="cursor: pointer; padding: 0.5rem 1rem; border: 1px solid #e5e7eb; background: white; border-radius: 0.25rem;">Remove</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="text-align: right; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; margin-bottom: 2rem;">
          <h2 style="margin: 0;">Total: ${Utils.formatPrice(Cart.getTotal())}</h2>
        </div>
        <div style="text-align: right;">
          <a href="#/products" class="btn btn-outline" style="margin-right: 1rem; padding: 0.75rem 1.5rem; border: 1px solid #e5e7eb; background: white; border-radius: 0.25rem; text-decoration: none; display: inline-block; cursor: pointer;">Continue Shopping</a>
          <button onclick="Utils.navigate('#/checkout')" class="btn btn-primary" style="cursor: pointer; padding: 0.75rem 1.5rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600;">Proceed to Checkout</button>
        </div>
      `;
    }

    cartHTML += `</div>${this.createFooter()}`;
    return cartHTML;
  },

  checkout() {
    const subtotal = Cart.getTotal();
    const shipping = 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    return `
      ${this.createNavbar()}
      <div style="max-width: 900px; margin: 2rem auto; padding: 0 1rem;">
        <h1 style="margin-bottom: 2rem;">Checkout</h1>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <div>
            <h3 style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #ff6b35;">Step 1: Shipping Address</h3>
            <form id="checkoutForm" onsubmit="handleCheckout(event)" style="display: flex; flex-direction: column; gap: 1rem;">
              <input type="text" id="fullName" placeholder="Full Name" required style="width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; box-sizing: border-box;">
              <input type="email" id="email" placeholder="Email" required style="width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; box-sizing: border-box;">
              <input type="text" id="phone" placeholder="Phone" required style="width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; box-sizing: border-box;">
              <input type="text" id="address" placeholder="Address" required style="width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; box-sizing: border-box;">
              <input type="text" id="city" placeholder="City" required style="width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; box-sizing: border-box;">
              <input type="text" id="zipcode" placeholder="Zip Code" required style="width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; box-sizing: border-box;">
              <button type="submit" class="btn btn-primary" style="cursor: pointer; padding: 1rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600; font-size: 1rem;">Continue to Payment →</button>
            </form>
          </div>
          <div style="background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; height: fit-content;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 1rem;">
              ${Cart.items.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                  <span>${item.name} x${item.quantity}</span>
                  <span>${Utils.formatPrice(item.price * item.quantity)}</span>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Subtotal:</span>
              <span>${Utils.formatPrice(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Shipping:</span>
              <span>${Utils.formatPrice(shipping)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
              <span>Tax (18%):</span>
              <span>${Utils.formatPrice(tax)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; color: #ff6b35;">
              <span>Total:</span>
              <span>${Utils.formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
      ${this.createFooter()}
    `;
  },

  about() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <h1>About Akart</h1>
        <p style="font-size: 1.1rem; line-height: 1.8;">Akart is a premium multi-vendor e-commerce platform connecting millions of buyers with trusted sellers. We're committed to providing the best shopping experience with fast delivery, secure payments, and exceptional customer service.</p>
        <h2 style="margin-top: 2rem;">Our Mission</h2>
        <p style="line-height: 1.8;">To revolutionize online shopping by empowering sellers and delighting customers with quality products and seamless transactions.</p>
      </div>
      ${this.createFooter()}
    `;
  },

  contact() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
        <h1>Contact Us</h1>
        <form style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="text" placeholder="Your Name" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <input type="email" placeholder="Your Email" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
          <textarea placeholder="Your Message" rows="5" required style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.25rem;"></textarea>
          <button type="submit" class="btn btn-primary" style="cursor: pointer; padding: 0.75rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600;">Send Message</button>
        </form>
      </div>
      ${this.createFooter()}
    `;
  },

  terms() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <h1>Terms and Conditions</h1>
        <p style="line-height: 1.8;">Welcome to Akart. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
        <h2 style="margin-top: 2rem;">1. Use License</h2>
        <p style="line-height: 1.8;">Permission is granted to temporarily download one copy of the materials (information or software) on Akart for personal, non-commercial transitory viewing only.</p>
        <h2 style="margin-top: 2rem;">2. Disclaimer</h2>
        <p style="line-height: 1.8;">The materials on Akart are provided on an 'as is' basis. Akart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </div>
      ${this.createFooter()}
    `;
  },

  privacy() {
    return `
      ${this.createNavbar()}
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <h1>Privacy Policy</h1>
        <p style="line-height: 1.8;">Akart is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
        <h2 style="margin-top: 2rem;">1. Information We Collect</h2>
        <p style="line-height: 1.8;">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
        <ul style="line-height: 1.8;">
          <li>Personal Data: Name, email address, phone number, shipping address</li>
          <li>Financial Data: Financial information, such as data related to your payment method</li>
          <li>Data From Social Networks: Your social network account information</li>
        </ul>
        <h2 style="margin-top: 2rem;">2. Use of Your Information</h2>
        <p style="line-height: 1.8;">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
        <ul style="line-height: 1.8;">
          <li>Process your transactions and send related information</li>
          <li>Email regarding your account or order</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site</li>
        </ul>
      </div>
      ${this.createFooter()}
    `;
  },

  notFound() {
    return `
      ${this.createNavbar()}
      <div style="text-align: center; padding: 4rem 1rem;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Page not found</p>
        <a href="#/" class="btn btn-primary" style="text-decoration: none; padding: 0.75rem 1.5rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600; display: inline-block; cursor: pointer;">Go Home</a>
      </div>
      ${this.createFooter()}
    `;
  }
};

// ============================================
// 7. EVENT HANDLERS
// ============================================
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  const success = await Auth.login(email, password);
  if (success) {
    Utils.showToast('Login successful!', 'success');
    setTimeout(() => Utils.navigate('#/'), 1000);
  } else {
    Utils.showToast('Login failed! Check your credentials.', 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  const success = await Auth.register(name, email, password);
  if (success) {
    Utils.showToast('Registration successful!', 'success');
    setTimeout(() => Utils.navigate('#/'), 1000);
  } else {
    Utils.showToast('Registration failed!', 'error');
  }
}

async function handleCheckout(event) {
  event.preventDefault();
  
  if (!Auth.isAuthenticated) {
    Utils.showToast('Please login first', 'error');
    Utils.navigate('#/login');
    return;
  }

  const subtotal = Cart.getTotal();
  const shipping = 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const orderData = {
    user_id: Auth.user.id,
    items: Cart.items,
    subtotal_amount: subtotal,
    shipping_amount: shipping,
    tax_amount: tax,
    total_amount: total,
    shipping_address: {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      zipcode: document.getElementById('zipcode').value
    }
  };

  try {
    // Create Razorpay order
    const paymentOrder = await API.createPaymentOrder({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: 'order_' + Date.now()
    });

    if (!paymentOrder.success) {
      Utils.showToast('Failed to create payment order', 'error');
      return;
    }

    // Razorpay payment options
    const options = {
      key: 'rzp_test_T6hm4bnUhKQOnp', // Your Razorpay Key ID
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      name: 'Akart',
      description: 'Order from Akart Marketplace',
      order_id: paymentOrder.id,
      handler: async function(response) {
        try {
          // Verify payment signature
          const verified = await API.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verified.success) {
            // Create order in database
            const order = await API.createOrder(orderData);
            if (order.success) {
              Cart.clear();
              Utils.showToast('✅ Payment successful! Order placed.', 'success');
              setTimeout(() => Utils.navigate('#/'), 2000);
            } else {
              Utils.showToast('Payment verified but order creation failed', 'error');
            }
          } else {
            Utils.showToast('❌ Payment verification failed', 'error');
          }
        } catch (error) {
          Utils.showToast('Payment verification error: ' + error.message, 'error');
        }
      },
      prefill: {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('phone').value
      },
      theme: {
        color: '#ff6b35'
      },
      modal: {
        ondismiss: function() {
          Utils.showToast('Payment cancelled', 'error');
        }
      }
    };

    // Open Razorpay checkout
    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    Utils.showToast('Checkout error: ' + error.message, 'error');
  }
}

// ============================================
// 8. ROUTER
// ============================================
async function renderPage() {
  const path = Utils.getCurrentPath();
  const app = document.getElementById('app');
  let content = '';

  switch (path) {
    case '/':
      content = Pages.home();
      break;
    case '/login':
      content = Pages.login();
      break;
    case '/register':
      content = Pages.register();
      break;
    case '/products':
      content = Pages.products();
      break;
    case '/cart':
      content = Pages.cart();
      break;
    case '/checkout':
      if (!Auth.isAuthenticated) {
        Utils.navigate('#/login');
        return;
      }
      content = Pages.checkout();
      break;
    case '/about':
      content = Pages.about();
      break;
    case '/contact':
      content = Pages.contact();
      break;
    case '/terms':
      content = Pages.terms();
      break;
    case '/privacy':
      content = Pages.privacy();
      break;
    default:
      content = Pages.notFound();
  }

  app.innerHTML = content;
}

// ============================================
// 9. INITIALIZATION
// ============================================
window.addEventListener('hashchange', renderPage);
window.addEventListener('load', () => {
  Theme.init();
  renderPage();
  loadProducts();
});

async function loadProducts() {
  try {
    const data = await API.getProducts();
    const container = document.getElementById('productsGrid') || document.getElementById('featuredProducts');
    if (container && data.products) {
      container.innerHTML = data.products.slice(0, 8).map(product => `
        <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; transition: transform 0.2s;">
          <div style="background: #f3f4f6; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">${product.image || '📦'}</div>
          <div style="padding: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${product.name}</h3>
            <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">${product.description?.substring(0, 50)}...</p>
            <p style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: bold; color: #ff6b35;">${Utils.formatPrice(product.price)}</p>
            <button onclick="Cart.addItem({id: ${product.id}, name: '${product.name}', price: ${product.price}}); Utils.showToast('Added to cart!', 'success');" class="btn btn-primary" style="width: 100%; cursor: pointer; padding: 0.75rem; border: none; background: #ff6b35; color: white; border-radius: 0.25rem; font-weight: 600;">Add to Cart</button>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Load Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
document.head.appendChild(script);
