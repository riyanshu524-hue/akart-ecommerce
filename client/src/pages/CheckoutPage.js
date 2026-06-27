import { BasePage } from './BasePage.js';

export default class CheckoutPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'CheckoutPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('CheckoutPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
