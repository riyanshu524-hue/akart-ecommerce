import { BasePage } from './BasePage.js';

export default class ProductsPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Products - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Products')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'Products page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
