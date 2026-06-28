import { BasePage } from './BasePage.js';

export default class ReturnRefundPolicyPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Return & Refund Policy - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Return & Refund Policy')}

      <div class="container mb-8">
        <div class="card">
          <h2 class="mb-4">Return & Refund Policy</h2>
          
          <h3 class="mt-6 mb-3">30-Day Return Policy</h3>
          <p class="mb-4">At Akart, we want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery for a full refund.</p>

          <h3 class="mt-6 mb-3">Eligibility Criteria</h3>
          <ul class="mb-4">
            <li>Product must be unused and in original packaging</li>
            <li>Return must be initiated within 30 days of delivery</li>
            <li>Product must not show signs of wear or damage</li>
            <li>All accessories and documentation must be included</li>
          </ul>

          <h3 class="mt-6 mb-3">How to Initiate a Return</h3>
          <ol class="mb-4">
            <li>Log in to your Akart account</li>
            <li>Go to "My Orders" and select the order</li>
            <li>Click "Return Item" and select your reason</li>
            <li>Print the prepaid shipping label</li>
            <li>Pack the item securely and ship it back</li>
          </ol>

          <h3 class="mt-6 mb-3">Refund Processing</h3>
          <p class="mb-4">Once we receive and inspect your return, we'll process your refund within 5-7 business days. The refund will be credited to your original payment method.</p>

          <h3 class="mt-6 mb-3">Non-Returnable Items</h3>
          <ul class="mb-4">
            <li>Consumables and perishables</li>
            <li>Personalized or custom-made items</li>
            <li>Items purchased on clearance</li>
            <li>Digital products and software</li>
          </ul>

          <h3 class="mt-6 mb-3">Contact Us</h3>
          <p>For any return or refund queries, please contact our support team at support@akart.com</p>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
