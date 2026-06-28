import { BasePage } from './BasePage.js';

export default class PaymentMethodsPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Payment Methods - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Payment Methods')}

      <div class="container mb-8">
        <div class="flex-between mb-6">
          <h2>Saved Payment Methods</h2>
          <button class="btn btn-primary">+ Add Payment Method</button>
        </div>

        <div class="grid-2">
          ${[1,2].map(i => `
            <div class="card">
              <div class="flex-between mb-3">
                <h4>💳 ${i === 1 ? 'Credit Card' : 'Debit Card'}</h4>
                ${i === 1 ? '<span class="badge badge-primary">Default</span>' : ''}
              </div>
              <p class="text-muted text-small mb-3">
                ${i === 1 ? 'Visa' : 'Mastercard'}<br>
                •••• •••• •••• ${4000 + i}
              </p>
              <p class="text-muted text-small mb-3">Expires: 12/${25 + i}</p>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm">Edit</button>
                <button class="btn btn-danger btn-sm">Delete</button>
                ${i !== 1 ? '<button class="btn btn-primary btn-sm">Set Default</button>' : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="card mt-6">
          <h3 class="mb-4">Add New Payment Method</h3>
          <form>
            <div class="mb-4">
              <label class="label">Card Holder Name</label>
              <input type="text" class="input" required>
            </div>
            <div class="mb-4">
              <label class="label">Card Number</label>
              <input type="text" class="input" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="grid-2 gap-4 mb-4">
              <div>
                <label class="label">Expiry Date</label>
                <input type="text" class="input" placeholder="MM/YY" required>
              </div>
              <div>
                <label class="label">CVV</label>
                <input type="text" class="input" placeholder="123" required>
              </div>
            </div>
            <div class="mb-4">
              <label class="label">
                <input type="checkbox"> Set as default payment method
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Card</button>
          </form>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
