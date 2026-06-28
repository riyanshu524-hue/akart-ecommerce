import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';
import { uiManager } from '../js/ui.js';

export default class ProductDetailPage extends BasePage {
  constructor(params) {
    super(params);
    this.productId = params.id;
    this.title = 'Product - Akart';
    this.product = null;
    this.relatedProducts = [];
    this.selectedVariant = null;
    this.selectedQuantity = 1;
  }

  async render() {
    try {
      await Promise.all([
        this.fetchProduct(),
        this.fetchRelatedProducts(),
      ]);

      if (!this.product) {
        return uiManager.showError('Product Not Found', 'The product you are looking for does not exist');
      }

      this.title = `${this.product.name} - Akart`;

      const primaryImage = this.product.product_images?.[0]?.image_url || '/placeholder.jpg';
      const rating = this.product.rating || 0;
      const stars = '⭐'.repeat(Math.floor(rating));

      return `
        ${this.createNavbar()}
        
        <div class="container mt-8 mb-8">
          <div class="grid-2" style="gap: 3rem;">
            <!-- Product Images -->
            <div>
              <div class="card" style="margin-bottom: 1rem; overflow: hidden; border-radius: 1rem;">
                <img id="mainImage" src="${this.escapeHtml(primaryImage)}" alt="${this.escapeHtml(this.product.name)}" style="width: 100%; height: 500px; object-fit: cover;">
              </div>
              
              <!-- Thumbnail Gallery -->
              ${this.product.product_images && this.product.product_images.length > 1 ? `
                <div class="flex gap-2" style="overflow-x: auto;">
                  ${this.product.product_images.map((img, idx) => `
                    <img src="${this.escapeHtml(img.image_url)}" alt="Thumbnail ${idx + 1}" 
                         class="thumbnail" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem; cursor: pointer; border: 2px solid transparent; transition: border 0.2s;"
                         onclick="document.getElementById('mainImage').src = '${this.escapeHtml(img.image_url)}'; this.style.borderColor = 'var(--brand-primary)';">
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Product Details -->
            <div>
              <h1 style="margin-bottom: 0.5rem;">${this.escapeHtml(this.product.name)}</h1>
              
              <!-- Rating -->
              <div class="flex-center gap-2 mb-4">
                <span>${stars || '★'}</span>
                <span class="text-muted">(${this.product.review_count || 0} reviews)</span>
              </div>

              <!-- Price -->
              <div class="mb-4">
                <span style="font-size: 1.5rem; font-weight: bold; color: var(--brand-primary);">${this.formatCurrency(this.product.price)}</span>
                ${this.product.compare_price ? `
                  <span class="text-muted" style="text-decoration: line-through; margin-left: 1rem;">
                    ${this.formatCurrency(this.product.compare_price)}
                  </span>
                ` : ''}
              </div>

              <!-- Description -->
              <p class="text-muted mb-6">${this.escapeHtml(this.product.description || this.product.short_description || '')}</p>

              <!-- Variants -->
              ${this.product.product_variants && this.product.product_variants.length > 0 ? `
                <div class="mb-6">
                  <h4 class="mb-2">Select Variant</h4>
                  <select class="input" id="variantSelect" style="width: 100%;">
                    <option value="">Choose an option</option>
                    ${this.product.product_variants.map(variant => `
                      <option value="${variant.id}" data-price="${variant.price || this.product.price}">
                        ${this.escapeHtml(variant.name)} - ${this.formatCurrency(variant.price || this.product.price)}
                      </option>
                    `).join('')}
                  </select>
                </div>
              ` : ''}

              <!-- Quantity -->
              <div class="mb-6">
                <h4 class="mb-2">Quantity</h4>
                <div class="flex-center gap-2" style="width: fit-content;">
                  <button class="btn btn-sm" onclick="document.getElementById('quantityInput').value = Math.max(1, parseInt(document.getElementById('quantityInput').value) - 1)">−</button>
                  <input type="number" id="quantityInput" class="input" value="1" min="1" max="${this.product.stock_quantity || 100}" style="width: 80px; text-align: center;">
                  <button class="btn btn-sm" onclick="document.getElementById('quantityInput').value = Math.min(${this.product.stock_quantity || 100}, parseInt(document.getElementById('quantityInput').value) + 1)">+</button>
                </div>
              </div>

              <!-- Stock Status -->
              <div class="mb-6">
                ${this.product.stock_quantity > 0 ? `
                  <p class="text-success">✓ In Stock (${this.product.stock_quantity} available)</p>
                ` : `
                  <p class="text-danger">✕ Out of Stock</p>
                `}
              </div>

              <!-- Seller Info -->
              <div class="card mb-6">
                <h4 class="mb-2">Sold by</h4>
                <p class="font-semibold">${this.escapeHtml(this.product.vendor?.store_name || 'Akart')}</p>
                <a href="/vendor/${this.product.vendor_id}" class="btn btn-outline btn-sm mt-2">Visit Store</a>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 mb-6">
                <button class="btn btn-primary" style="flex: 1; font-size: 1rem;" onclick="document.getElementById('addToCartBtn').click()">🛒 Add to Cart</button>
                <button class="btn btn-outline" style="flex: 1; font-size: 1rem;" onclick="document.getElementById('addToWishlistBtn').click()">❤️ Wishlist</button>
              </div>

              <!-- Shipping Info -->
              <div class="card" style="background-color: var(--bg-secondary);">
                <h4 class="mb-2">Shipping & Returns</h4>
                <ul style="list-style: none; padding: 0;">
                  <li class="mb-1">✓ Free shipping on orders above ₹500</li>
                  <li class="mb-1">✓ 7-day easy returns</li>
                  <li class="mb-1">✓ 100% authentic products</li>
                  <li>✓ Secure payments</li>
                </ul>
              </div>

              <!-- Hidden buttons for actions -->
              <button id="addToCartBtn" style="display: none;"></button>
              <button id="addToWishlistBtn" style="display: none;"></button>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="mt-8">
            <h2 class="mb-4">Customer Reviews</h2>
            ${this.product.reviews && this.product.reviews.length > 0 ? `
              <div class="grid-1" style="gap: 1.5rem;">
                ${this.product.reviews.slice(0, 5).map(review => `
                  <div class="card">
                    <div class="flex-between mb-2">
                      <h4>${this.escapeHtml(review.title || 'Review')}</h4>
                      <span>${'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p class="text-muted text-small mb-2">${this.escapeHtml(review.comment || '')}</p>
                    <p class="text-muted text-small">Verified Purchase • ${this.formatDate(review.created_at)}</p>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-muted">No reviews yet. Be the first to review this product!</p>
            `}
          </div>

          <!-- Related Products -->
          ${this.relatedProducts.length > 0 ? `
            <div class="mt-8">
              <h2 class="mb-4">Related Products</h2>
              <div class="grid-4">
                ${this.relatedProducts.slice(0, 4).map(product => `
                  <a href="/product/${product.id}" style="text-decoration: none; color: inherit;">
                    ${this.createProductCard(product)}
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        ${this.createFooter()}
      `;
    } catch (error) {
      console.error('Error rendering product detail:', error);
      return uiManager.showError('Error', 'Failed to load product details');
    }
  }

  async init() {
    super.init();

    const addToCartBtn = document.getElementById('addToCartBtn');
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantityInput').value);
        uiManager.toast(`Added ${quantity} item(s) to cart`, 'success');
      });
    }

    if (addToWishlistBtn) {
      addToWishlistBtn.addEventListener('click', () => {
        uiManager.toast('Added to wishlist', 'success');
      });
    }
  }

  async fetchProduct() {
    try {
      this.product = await api.get(`/products/${this.productId}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      this.product = null;
    }
  }

  async fetchRelatedProducts() {
    try {
      const data = await api.get(`/products/${this.productId}/related`);
      this.relatedProducts = data.products || [];
    } catch (error) {
      console.error('Error fetching related products:', error);
      this.relatedProducts = [];
    }
  }

  createProductCard(product) {
    const rating = product.rating || 0;
    const stars = '⭐'.repeat(Math.floor(rating));
    const image = product.product_images?.[0]?.image_url || '/placeholder.jpg';
    
    return `
      <div class="card-product hover-lift">
        <img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(product.name)}" class="card-product-image" style="object-fit: cover;">
        <div class="card-product-body">
          <h4 style="margin-bottom: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(product.name)}</h4>
          <div class="flex-between mb-2">
            <span style="font-weight: bold; color: var(--brand-primary);">${this.formatCurrency(product.price)}</span>
            <span class="text-small">${stars || '★'}</span>
          </div>
          <button class="btn btn-primary" style="width: 100%; font-size: 0.9rem;">Add to Cart</button>
        </div>
      </div>
    `;
  }
}
