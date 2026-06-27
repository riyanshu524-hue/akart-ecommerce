import { BasePage } from './BasePage.js';

export default class OrdersPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'OrdersPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('OrdersPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
