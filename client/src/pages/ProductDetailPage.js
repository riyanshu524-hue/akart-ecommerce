import { BasePage } from './BasePage.js';

export default class ProductDetailPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'ProductDetailPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('ProductDetailPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
