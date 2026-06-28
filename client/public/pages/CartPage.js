import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';
import { uiManager } from '../js/ui.js';

export default class CartPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Shopping Cart - Akart';
    this.cartItems = [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
  }

  async render() {
    try {
      this.loadCart();
      this.calculateTotals();

      return `
        ${this.createNavbar()}
        ${this.createHeader('Shopping Cart')}

        <div class="container mb-8">
          <div class="grid-3-1">
            <!-- Cart Items -->
            <main>
              ${this.cartItems.length > 0 ? `
                <div class="card">
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="border-bottom: 2px solid var(--border-color);">
                        <th style="text-align: left; padding: 1rem;">Product</th>
                        <th style="text-align: center; padding: 1rem;">Price</th>
                        <th style="text-align: center; padding: 1rem;">Quantity</th>
                        <th style="text-align: right; padding: 1rem;">Total</th>
                        <th style="text-align: center; padding: 1rem;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.cartItems.map((item, idx) => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                          <td style="padding: 1rem;">
                            <div class="flex gap-3">
                              <img src="${this.escapeHtml(item.image)}" alt="${this.escapeHtml(item.name)}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem;">
                              <div>
                                <h4 style="margin-bottom: 0.25rem;">${this.escapeHtml(item.name)}</h4>
                                <p class="text-muted text-small">${this.escapeHtml(item.variant || '')}</p>
                              </div>
                            </div>
                          </td>
                          <td style="text-align: center; padding: 1rem;">${this.formatCurrency(item.price)}</td>
                          <td style="text-align: center; padding: 1rem;">
                            <div class="flex-center gap-2" style="width: fit-content; margin: 0 auto;">
                              <button class="btn btn-sm" onclick="window.cartPage.updateQuantity(${idx}, -1)">−</button>
                              <input type="number" value="${item.quantity}" style="width: 50px; text-align: center; border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 0.25rem;" onchange="window.cartPage.updateQuantity(${idx}, this.value - ${item.quantity})">
                              <button class="btn btn-sm" onclick="window.cartPage.updateQuantity(${idx}, 1)">+</button>
                            </div>
                          </td>
                          <td style="text-align: right; padding: 1rem; font-weight: bold;">${this.formatCurrency(item.price * item.quantity)}</td>
                          <td style="text-align: center; padding: 1rem;">
                            <button class="btn btn-sm btn-danger" onclick="window.cartPage.removeItem(${idx})">Remove</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                <!-- Continue Shopping -->
                <div class="mt-4">
                  <a href="/products" class="btn btn-outline">← Continue Shopping</a>
                </div>
              ` : `
                <div class="card">
                  ${this.showEmpty('Cart is Empty', 'Add items to your cart to get started')}
                  <a href="/products" class="btn btn-primary mt-4">Start Shopping</a>
                </div>
              `}
            </main>

            <!-- Order Summary -->
            <aside>
              <div class="card" style="position: sticky; top: 100px;">
                <h3 class="mb-4">Order Summary</h3>

                <div class="flex-between mb-3">
                  <span>Subtotal</span>
                  <span>${this.formatCurrency(this.subtotal)}</span>
                </div>

                <div class="flex-between mb-3">
                  <span>Shipping</span>
                  <span class="text-success">${this.shipping === 0 ? 'FREE' : this.formatCurrency(this.shipping)}</span>
                </div>

                <div class="flex-between mb-3">
                  <span>Tax</span>
                  <span>${this.formatCurrency(this.tax)}</span>
                </div>

                <div style="border-top: 2px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
                  <div class="flex-between mb-4" style="font-size: 1.2rem; font-weight: bold;">
                    <span>Total</span>
                    <span style="color: var(--brand-primary);">${this.formatCurrency(this.total)}</span>
                  </div>
                </div>

                ${this.cartItems.length > 0 ? `
                  <button class="btn btn-primary" style="width: 100%; font-size: 1rem; margin-bottom: 1rem;" onclick="window.location.href='/checkout'">Proceed to Checkout</button>
                  <button class="btn btn-outline" style="width: 100%;">Save for Later</button>
                ` : ''}

                <!-- Promo Code -->
                <div class="mt-6">
                  <h4 class="mb-2">Promo Code</h4>
                  <div class="flex gap-2">
                    <input type="text" class="input" placeholder="Enter code" style="flex: 1;">
                    <button class="btn btn-sm">Apply</button>
                  </div>
                </div>

                <!-- Offers -->
                <div class="mt-6 p-3" style="background-color: var(--bg-secondary); border-radius: 0.5rem;">
                  <h4 class="mb-2">Available Offers</h4>
                  <ul style="list-style: none; padding: 0; font-size: 0.9rem;">
                    <li class="mb-1">✓ Free shipping on orders above ₹500</li>
                    <li class="mb-1">✓ 10% cashback on credit cards</li>
                    <li>✓ Extra 5% off on prepaid orders</li>
                  </ul>
                </div>
              </aside>
            </div>
        </div>

        ${this.createFooter()}
      `;
    } catch (error) {
      console.error('Error rendering cart:', error);
      return uiManager.showError('Error', 'Failed to load cart');
    }
  }

  async init() {
    super.init();
    window.cartPage = this;
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartItems = cart;
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = Math.round(this.subtotal * 0.18 * 100) / 100; // 18% GST
    this.shipping = this.subtotal >= 500 ? 0 : 99;
    this.total = this.subtotal + this.tax + this.shipping;
  }

  updateQuantity(index, change) {
    const newQuantity = Math.max(1, this.cartItems[index].quantity + parseInt(change));
    this.cartItems[index].quantity = newQuantity;
    this.saveCart();
    window.location.reload();
  }

  removeItem(index) {
    this.cartItems.splice(index, 1);
    this.saveCart();
    window.location.reload();
  }
}
