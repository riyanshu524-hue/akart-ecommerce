import { BasePage } from './BasePage.js';

export default class TermsPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Terms & Conditions - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Terms & Conditions')}

      <div class="container mb-8" style="max-width: 800px;">
        <div class="card">
          <h2>Terms & Conditions</h2>
          <p class="text-muted">Last updated: June 2026</p>

          <h3 class="mt-6">1. Introduction</h3>
          <p>Welcome to Akart. These terms and conditions govern your use of our platform and services.</p>

          <h3 class="mt-6">2. User Responsibilities</h3>
          <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>

          <h3 class="mt-6">3. Product Information</h3>
          <p>We strive to provide accurate product information. However, we do not warrant that product descriptions, pricing, or availability are accurate, complete, or error-free.</p>

          <h3 class="mt-6">4. Limitation of Liability</h3>
          <p>In no event shall Akart be liable for any indirect, incidental, special, consequential, or punitive damages.</p>

          <h3 class="mt-6">5. Governing Law</h3>
          <p>These terms shall be governed by and construed in accordance with the laws of India.</p>

          <div class="mt-8">
            <a href="/" class="btn btn-primary">Back to Home</a>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
