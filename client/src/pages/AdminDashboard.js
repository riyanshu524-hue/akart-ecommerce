import { BasePage } from './BasePage.js';

export default class AdminDashboard extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'AdminDashboard - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('AdminDashboard')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
