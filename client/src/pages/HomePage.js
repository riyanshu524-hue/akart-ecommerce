/**
 * HomePage - Main landing page with hero, featured products, and categories
 */

import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';
import { uiManager } from '../js/ui.js';

export default class HomePage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Akart - Shop Everything';
    this.description = 'Discover millions of products from trusted sellers on Akart';
    this.products = [];
    this.categories = [];
  }

  async render() {
    try {
      // Fetch data
      await Promise.all([
        this.fetchProducts(),
        this.fetchCategories(),
      ]);

      return `
        ${this.createNavbar()}
        
        <!-- Hero Section -->
        <section class="hero gradient-primary" style="padding: 4rem 0; color: white;">
          <div class="container">
            <div class="grid-2" style="align-items: center;">
              <div>
                <h1 class="text-hero" style="color: white; margin-bottom: 1rem;">
                  Welcome to Akart
                </h1>
                <p class="text-large" style="margin-bottom: 2rem; opacity: 0.9;">
                  Discover millions of products from trusted sellers. Fast delivery, secure payments, and hassle-free returns.
                </p>
                <button class="btn btn-lg" style="background-color: white; color: var(--brand-primary);">
                  Start Shopping
                </button>
              </div>
              <div style="text-align: center; font-size: 5rem;">
                🛍️
              </div>
            </div>
          </div>
        </section>

        <!-- Categories Section -->
        <section class="container mt-8 mb-8">
          <h2 class="mb-4">Shop by Category</h2>
          <div class="grid-4">
            ${this.categories.map(cat => `
              <a href="/products?category=${cat.id}" class="card hover-lift" style="text-align: center; text-decoration: none;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${cat.icon || '📦'}</div>
                <h4>${this.escapeHtml(cat.name)}</h4>
                <p class="text-small text-muted">${cat.count || 0} products</p>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Flash Deals Section -->
        <section class="container mb-8">
          <div class="flex-between mb-4">
            <h2>⚡ Flash Deals</h2>
            <a href="/products?deals=true" class="btn btn-outline btn-sm">View All</a>
          </div>
          <div class="grid-4">
            ${this.products.slice(0, 4).map(product => `
              <a href="/product/${product.id}" style="text-decoration: none; color: inherit;">
                ${this.createProductCard(product)}
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Featured Products Section -->
        <section class="container mb-8">
          <h2 class="mb-4">Featured Products</h2>
          <div class="grid-4">
            ${this.products.slice(4, 8).map(product => `
              <a href="/product/${product.id}" style="text-decoration: none; color: inherit;">
                ${this.createProductCard(product)}
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Newsletter Section -->
        <section class="glass" style="padding: 3rem; border-radius: 1rem; margin: 2rem 0; text-align: center;">
          <div class="container">
            <h2 class="mb-2">Subscribe to Our Newsletter</h2>
            <p class="text-muted mb-4">Get exclusive deals and updates delivered to your inbox</p>
            <div class="flex-center gap-2" style="max-width: 500px; margin: 0 auto;">
              <input type="email" class="input" placeholder="Enter your email" style="flex: 1;">
              <button class="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </section>

        <!-- Testimonials Section -->
        <section class="container mb-8">
          <h2 class="mb-4">What Our Customers Say</h2>
          <div class="grid-3">
            <div class="card">
              <div class="mb-2">⭐⭐⭐⭐⭐</div>
              <p>"Amazing selection and fast delivery! Highly recommended."</p>
              <p class="text-small font-semibold mt-2">- Priya Sharma</p>
            </div>
            <div class="card">
              <div class="mb-2">⭐⭐⭐⭐⭐</div>
              <p>"Best prices I've found online. Great customer service too!"</p>
              <p class="text-small font-semibold mt-2">- Rajesh Kumar</p>
            </div>
            <div class="card">
              <div class="mb-2">⭐⭐⭐⭐⭐</div>
              <p>"Love the variety and quality. Will definitely shop again."</p>
              <p class="text-small font-semibold mt-2">- Anjali Patel</p>
            </div>
          </div>
        </section>

        ${this.createFooter()}
      `;
    } catch (error) {
      console.error('Error rendering home page:', error);
      return uiManager.showEmpty('Failed to Load', 'Please refresh the page');
    }
  }

  async init() {
    super.init();

    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent.includes('Start Shopping')) {
        btn.addEventListener('click', () => window.location.href = '/products');
      }
      if (btn.textContent.includes('Subscribe')) {
        btn.addEventListener('click', this.handleSubscribe.bind(this));
      }
    });

    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value;
          window.location.href = `/products?search=${encodeURIComponent(query)}`;
        }
      });
    }
  }

  async fetchProducts() {
    try {
      const data = await api.get('/products?limit=8');
      this.products = data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      this.products = this.getMockProducts();
    }
  }

  async fetchCategories() {
    try {
      const data = await api.get('/categories');
      this.categories = data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      this.categories = this.getMockCategories();
    }
  }

  handleSubscribe() {
    const email = document.querySelector('input[type="email"]').value;
    if (!email) {
      uiManager.toast('Please enter your email', 'warning');
      return;
    }
    uiManager.toast('Thanks for subscribing!', 'success');
  }

  createProductCard(product) {
    const rating = product.rating || 4;
    const stars = '⭐'.repeat(Math.floor(rating));

    const image =
      product.product_images?.find(img => img.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      '/placeholder.jpg';

    return `
      <div class="card-product hover-lift">
        <img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(product.name)}" class="card-product-image" style="object-fit: cover;">
        <div class="card-product-body">
          <h4 style="margin-bottom: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(product.name)}</h4>
          <p class="text-muted text-small" style="margin-bottom: 0.5rem;">${this.escapeHtml(product.category || 'Electronics')}</p>
          <div class="flex-between mb-2">
            <span style="font-weight: bold; color: var(--brand-primary); font-size: 1.1rem;">${this.formatCurrency(product.price)}</span>
            <span class="text-small">${stars}</span>
          </div>
          <button class="btn btn-primary" style="width: 100%; font-size: 0.9rem;">Add to Cart</button>
        </div>
      </div>
    `;
  }
