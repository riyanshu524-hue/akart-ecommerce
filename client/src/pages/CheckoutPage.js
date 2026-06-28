import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';
import { uiManager } from '../js/ui.js';

export default class CheckoutPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Checkout - Akart';
    this.step = 1;
    this.cartItems = [];
    this.addresses = [];
    this.selectedAddress = null;
    this.orderData = {};
  }

  async render() {
    this.loadCart();
    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const shipping = subtotal >= 500 ? 0 : 99;
    const total = subtotal + tax + shipping;

    return `
      ${this.createNavbar()}
      ${this.createHeader('Checkout')}

      <div class="container mb-8">
        <!-- Progress Steps -->
        <div class="flex-center gap-2 mb-8" style="justify-content: space-between;">
          <div class="flex-center gap-2" style="flex: 1;">
            <div class="step-circle ${this.step >= 1 ? 'active' : ''}">1</div>
            <span>Address</span>
          </div>
          <div style="flex: 1; height: 2px; background: ${this.step >= 2 ? 'var(--brand-primary)' : 'var(--border-color)'}; margin: 0 1rem;"></div>
          <div class="flex-center gap-2" style="flex: 1;">
            <div class="step-circle ${this.step >= 2 ? 'active' : ''}">2</div>
            <span>Shipping</span>
          </div>
          <div style="flex: 1; height: 2px; background: ${this.step >= 3 ? 'var(--brand-primary)' : 'var(--border-color)'}; margin: 0 1rem;"></div>
          <div class="flex-center gap-2" style="flex: 1;">
            <div class="step-circle ${this.step >= 3 ? 'active' : ''}">3</div>
            <span>Payment</span>
          </div>
        </div>

        <div class="grid-3-1">
          <!-- Checkout Form -->
          <main>
            ${this.step === 1 ? this.renderAddressStep() : ''}
            ${this.step === 2 ? this.renderShippingStep() : ''}
            ${this.step === 3 ? this.renderPaymentStep() : ''}
          </main>

          <!-- Order Summary -->
          <aside>
            <div class="card" style="position: sticky; top: 100px;">
              <h3 class="mb-4">Order Summary</h3>
              ${this.cartItems.map(item => `
                <div class="flex-between mb-2 text-small">
                  <span>${this.escapeHtml(item.name)} x${item.quantity}</span>
                  <span>${this.formatCurrency(item.price * item.quantity)}</span>
                </div>
              `).join('')}
              <div style="border-top: 2px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
                <div class="flex-between mb-2">
                  <span>Subtotal</span>
                  <span>${this.formatCurrency(subtotal)}</span>
                </div>
                <div class="flex-between mb-2">
                  <span>Shipping</span>
                  <span>${shipping === 0 ? 'FREE' : this.formatCurrency(shipping)}</span>
                </div>
                <div class="flex-between mb-2">
                  <span>Tax</span>
                  <span>${this.formatCurrency(tax)}</span>
                </div>
                <div class="flex-between" style="font-size: 1.2rem; font-weight: bold; color: var(--brand-primary);">
                  <span>Total</span>
                  <span>${this.formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }

  renderAddressStep() {
    return `
      <div class="card">
        <h3 class="mb-4">Delivery Address</h3>
        <form id="addressForm">
          <div class="grid-2 gap-4 mb-4">
            <input type="text" class="input" placeholder="Full Name" required>
            <input type="tel" class="input" placeholder="Phone Number" required>
            <input type="email" class="input" placeholder="Email" required>
            <input type="text" class="input" placeholder="Pincode" required>
          </div>
          <textarea class="input" placeholder="Address" rows="3" required></textarea>
          <div class="grid-2 gap-4 mt-4">
            <input type="text" class="input" placeholder="City" required>
            <input type="text" class="input" placeholder="State" required>
          </div>
          <div class="flex gap-2 mt-6">
            <button type="button" class="btn btn-outline" onclick="window.location.href='/cart'">Back</button>
            <button type="button" class="btn btn-primary" onclick="window.checkoutPage.nextStep()">Continue to Shipping</button>
          </div>
        </form>
      </div>
    `;
  }

  renderShippingStep() {
    return `
      <div class="card">
        <h3 class="mb-4">Shipping Method</h3>
        <div class="mb-4">
          <label class="flex gap-3 p-3 border-2 border-brand-primary" style="cursor: pointer;">
            <input type="radio" name="shipping" value="standard" checked>
            <div>
              <h4>Standard Delivery</h4>
              <p class="text-muted text-small">Delivery in 5-7 business days</p>
              <p class="text-muted text-small">₹99</p>
            </div>
          </label>
        </div>
        <div class="mb-4">
          <label class="flex gap-3 p-3 border-2 border-border-color" style="cursor: pointer;">
            <input type="radio" name="shipping" value="express">
            <div>
              <h4>Express Delivery</h4>
              <p class="text-muted text-small">Delivery in 2-3 business days</p>
              <p class="text-muted text-small">₹299</p>
            </div>
          </label>
        </div>
        <div class="flex gap-2 mt-6">
          <button type="button" class="btn btn-outline" onclick="window.checkoutPage.prevStep()">Back</button>
          <button type="button" class="btn btn-primary" onclick="window.checkoutPage.nextStep()">Continue to Payment</button>
        </div>
      </div>
    `;
  }

  renderPaymentStep() {
    return `
      <div class="card">
        <h3 class="mb-4">Payment Method</h3>
        <div class="mb-4">
          <label class="flex gap-3 p-3 border-2 border-brand-primary" style="cursor: pointer;">
            <input type="radio" name="payment" value="razorpay" checked>
            <div>
              <h4>Credit/Debit Card</h4>
              <p class="text-muted text-small">Secure payment via Razorpay</p>
            </div>
          </label>
        </div>
        <div class="mb-4">
          <label class="flex gap-3 p-3 border-2 border-border-color" style="cursor: pointer;">
            <input type="radio" name="payment" value="upi">
            <div>
              <h4>UPI</h4>
              <p class="text-muted text-small">Pay using Google Pay, PhonePe, or Paytm</p>
            </div>
          </label>
        </div>
        <div class="mb-4">
          <label class="flex gap-3 p-3 border-2 border-border-color" style="cursor: pointer;">
            <input type="radio" name="payment" value="netbanking">
            <div>
              <h4>Net Banking</h4>
              <p class="text-muted text-small">Pay directly from your bank account</p>
            </div>
          </label>
        </div>
        <div class="flex gap-2 mt-6">
          <button type="button" class="btn btn-outline" onclick="window.checkoutPage.prevStep()">Back</button>
          <button type="button" class="btn btn-primary" style="font-size: 1rem;" onclick="window.checkoutPage.processPayment()">Pay Now</button>
        </div>
      </div>
    `;
  }

  loadCart() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  nextStep() {
    this.step = Math.min(3, this.step + 1);
    window.location.reload();
  }

  prevStep() {
    this.step = Math.max(1, this.step - 1);
    window.location.reload();
  }

  async processPayment() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    uiManager.toast('Processing payment...', 'info');
    // Payment will be handled by Razorpay integration
    setTimeout(() => {
      window.location.href = '/order-confirmation';
    }, 2000);
  }

  async init() {
    super.init();
    window.checkoutPage = this;
  }
}
