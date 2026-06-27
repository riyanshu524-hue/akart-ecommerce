import { BasePage } from './BasePage.js';

export default class RefundPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'RefundPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('RefundPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
