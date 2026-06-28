import { BasePage } from './BasePage.js';

export default class OrderConfirmationPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Order Confirmed - Akart';
    this.orderId = 'ORD-2026-001234';
  }

  async render() {
    return `
      ${this.createNavbar()}

      <div class="container mb-8" style="max-width: 600px; margin-left: auto; margin-right: auto;">
        <div class="card" style="text-align: center; padding: 3rem;">
          <h1 style="color: var(--success); font-size: 3rem; margin-bottom: 1rem;">✓</h1>
          <h2 class="mb-2">Order Confirmed!</h2>
          <p class="text-muted mb-4">Thank you for your purchase. Your order has been confirmed.</p>
          
          <div class="card" style="background-color: var(--bg-secondary); margin-bottom: 2rem;">
            <h4 class="mb-2">Order ID</h4>
            <p style="font-size: 1.2rem; font-weight: bold; color: var(--brand-primary);">${this.orderId}</p>
          </div>

          <div class="grid-2 gap-4 mb-4">
            <div>
              <h4 class="text-muted">Estimated Delivery</h4>
              <p class="font-semibold">5-7 Business Days</p>
            </div>
            <div>
              <h4 class="text-muted">Order Total</h4>
              <p class="font-semibold">₹5,999</p>
            </div>
          </div>

          <div class="flex gap-2">
            <a href="/orders" class="btn btn-primary" style="flex: 1;">Track Order</a>
            <a href="/products" class="btn btn-outline" style="flex: 1;">Continue Shopping</a>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
