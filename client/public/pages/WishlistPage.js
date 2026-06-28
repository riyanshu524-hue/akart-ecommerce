import { BasePage } from './BasePage.js';
import { uiManager } from '../js/ui.js';

export default class WishlistPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Wishlist - Akart';
    this.wishlist = [];
  }

  async render() {
    this.loadWishlist();

    return `
      ${this.createNavbar()}
      ${this.createHeader('My Wishlist')}

      <div class="container mb-8">
        ${this.wishlist.length > 0 ? `
          <div class="grid-4">
            ${this.wishlist.map((product, idx) => `
              <div class="card-product hover-lift">
                <img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(product.name)}" class="card-product-image">
                <div class="card-product-body">
                  <h4 style="margin-bottom: 0.5rem;">${this.escapeHtml(product.name)}</h4>
                  <div class="flex-between mb-2">
                    <span style="font-weight: bold; color: var(--brand-primary);">${this.formatCurrency(product.price)}</span>
                    <button class="btn btn-sm btn-danger" onclick="window.wishlistPage.removeItem(${idx})">✕</button>
                  </div>
                  <button class="btn btn-primary" style="width: 100%;" onclick="window.wishlistPage.addToCart(${idx})">Add to Cart</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card">
            ${this.showEmpty('Wishlist is Empty', 'Add items to your wishlist')}
            <a href="/products" class="btn btn-primary mt-4">Start Shopping</a>
          </div>
        `}
      </div>

      ${this.createFooter()}
    `;
  }

  async init() {
    super.init();
    window.wishlistPage = this;
  }

  loadWishlist() {
    this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  }

  saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  removeItem(index) {
    this.wishlist.splice(index, 1);
    this.saveWishlist();
    window.location.reload();
  }

  addToCart(index) {
    const item = this.wishlist[index];
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    uiManager.toast('Added to cart', 'success');
  }
}
