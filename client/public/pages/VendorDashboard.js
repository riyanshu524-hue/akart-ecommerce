import { BasePage } from './BasePage.js';

export default class VendorDashboard extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'VendorDashboard - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('VendorDashboard')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
