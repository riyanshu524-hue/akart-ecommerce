import { BasePage } from './BasePage.js';

export default class CartPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'CartPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('CartPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
