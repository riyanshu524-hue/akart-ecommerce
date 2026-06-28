import { BasePage } from './BasePage.js';

export default class PrivacyPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Privacy Policy - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Privacy Policy')}

      <div class="container mb-8" style="max-width: 800px;">
        <div class="card">
          <h2>Privacy Policy</h2>
          <p class="text-muted">Last updated: June 2026</p>

          <h3 class="mt-6">1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us.</p>

          <h3 class="mt-6">2. How We Use Your Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send promotional communications.</p>

          <h3 class="mt-6">3. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access.</p>

          <h3 class="mt-6">4. Your Rights</h3>
          <p>You have the right to access, correct, or delete your personal information. Contact us for assistance.</p>

          <h3 class="mt-6">5. Contact Us</h3>
          <p>If you have questions about this privacy policy, please contact us at privacy@akart.com</p>

          <div class="mt-8">
            <a href="/" class="btn btn-primary">Back to Home</a>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
