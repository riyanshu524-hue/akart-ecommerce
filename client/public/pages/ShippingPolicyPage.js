import { BasePage } from './BasePage.js';

export default class ShippingPolicyPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Shipping Policy - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Shipping Policy')}

      <div class="container mb-8">
        <div class="card">
          <h2 class="mb-4">Shipping Policy</h2>
          
          <h3 class="mt-6 mb-3">Delivery Timeline</h3>
          <table style="width: 100%; margin-bottom: 2rem;">
            <tr style="border-bottom: 2px solid var(--border-color);">
              <th style="text-align: left; padding: 1rem;">Shipping Method</th>
              <th style="text-align: left; padding: 1rem;">Delivery Time</th>
              <th style="text-align: left; padding: 1rem;">Cost</th>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 1rem;">Standard Shipping</td>
              <td style="padding: 1rem;">5-7 business days</td>
              <td style="padding: 1rem;">₹99</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 1rem;">Express Shipping</td>
              <td style="padding: 1rem;">2-3 business days</td>
              <td style="padding: 1rem;">₹299</td>
            </tr>
            <tr>
              <td style="padding: 1rem;">Overnight Shipping</td>
              <td style="padding: 1rem;">Next business day</td>
              <td style="padding: 1rem;">₹599</td>
            </tr>
          </table>

          <h3 class="mt-6 mb-3">Shipping Coverage</h3>
          <p class="mb-4">We ship to all major cities and towns across India. Orders are typically processed within 24 hours of placement.</p>

          <h3 class="mt-6 mb-3">Tracking Your Order</h3>
          <p class="mb-4">You'll receive a tracking number via email once your order ships. You can use this to track your package in real-time.</p>

          <h3 class="mt-6 mb-3">Shipping Restrictions</h3>
          <ul class="mb-4">
            <li>Some items may have restricted shipping areas</li>
            <li>Hazardous materials cannot be shipped</li>
            <li>International shipping is not available</li>
          </ul>

          <h3 class="mt-6 mb-3">Damaged or Lost Packages</h3>
          <p class="mb-4">If your package arrives damaged or is lost in transit, please contact us immediately with photos and tracking information. We'll arrange a replacement or refund.</p>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
