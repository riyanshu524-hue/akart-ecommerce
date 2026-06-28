import { BasePage } from './BasePage.js';

export default class VendorPage extends BasePage {
  constructor(params) {
    super(params);
    this.vendorId = params.id;
    this.title = 'Vendor Store - Akart';
    this.vendor = { name: 'Premium Electronics', rating: 4.5, followers: 12500 };
  }

  async render() {
    return `
      ${this.createNavbar()}

      <div class="container mb-8">
        <div class="card mb-6">
          <div class="flex-between">
            <div>
              <h2>${this.escapeHtml(this.vendor.name)}</h2>
              <p class="text-muted">⭐ ${this.vendor.rating} • ${this.vendor.followers.toLocaleString()} followers</p>
            </div>
            <button class="btn btn-primary">Follow Store</button>
          </div>
        </div>

        <div class="grid-4">
          ${[1,2,3,4,5,6,7,8].map(i => `
            <div class="card-product hover-lift">
              <img src="/placeholder.jpg" alt="Product" class="card-product-image">
              <div class="card-product-body">
                <h4>Product ${i}</h4>
                <div class="flex-between">
                  <span style="font-weight: bold; color: var(--brand-primary);">₹${(i * 1000).toLocaleString()}</span>
                  <span>⭐4.5</span>
                </div>
                <button class="btn btn-primary" style="width: 100%; font-size: 0.9rem;">Add to Cart</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
