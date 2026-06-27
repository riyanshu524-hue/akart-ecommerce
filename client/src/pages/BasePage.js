/**
 * Base Page Class - All pages should extend this
 */

export class BasePage {
  constructor(params = {}) {
    this.params = params;
    this.title = 'Akart';
    this.description = '';
  }

  /**
   * Render page HTML
   * Must be implemented by subclasses
   */
  async render() {
    return `
      <div class="container mt-8">
        <div class="card text-center">
          <h1>Page Not Implemented</h1>
          <p>This page is under construction.</p>
        </div>
      </div>
    `;
  }

  /**
   * Initialize page (called after render)
   * Optional, can be overridden by subclasses
   */
  async init() {
    this.updatePageTitle();
  }

  /**
   * Update page title and meta tags
   */
  updatePageTitle() {
    document.title = this.title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = this.description;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format currency
   */
  formatCurrency(amount, currency = '₹') {
    return `${currency}${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * Format date
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Create header with back button
   */
  createHeader(title, showBack = false) {
    return `
      <div class="container mt-4 mb-6">
        <div class="flex-between">
          <div>
            ${showBack ? '<button class="btn btn-sm" onclick="history.back()">← Back</button>' : ''}
            <h1 style="margin-top: ${showBack ? '0.5rem' : '0'}">${this.escapeHtml(title)}</h1>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create footer
   */
  createFooter() {
    return `
      <footer class="bg-secondary mt-8 p-8">
        <div class="container">
          <div class="grid-3 mb-6">
            <div>
              <h4 class="mb-3">About Akart</h4>
              <ul style="list-style: none;">
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/press">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 class="mb-3">Customer Service</h4>
              <ul style="list-style: none;">
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/shipping">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 class="mb-3">Legal</h4>
              <ul style="list-style: none;">
                <li><a href="/terms">Terms & Conditions</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/refund">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div class="text-center text-muted border-top pt-4">
            <p>&copy; 2024 Akart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  /**
   * Create navigation bar
   */
  createNavbar() {
    return `
      <nav class="navbar">
        <div class="container flex-between" style="padding: 1rem 0;">
          <div class="flex-center gap-4">
            <a href="/" class="text-hero" style="font-size: 1.5rem; font-weight: 800; color: var(--brand-primary);">
              Akart
            </a>
          </div>
          <div class="flex-center gap-4">
            <input type="search" class="input" placeholder="Search products..." style="width: 300px;">
            <a href="/cart" class="btn btn-sm">🛒 Cart</a>
            <a href="/profile" class="btn btn-sm">👤 Profile</a>
            <button class="btn btn-sm" onclick="document.body.classList.toggle('dark-mode')">🌙</button>
          </div>
        </div>
      </nav>
    `;
  }
}
