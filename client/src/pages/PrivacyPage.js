import { BasePage } from './BasePage.js';

export default class PrivacyPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'PrivacyPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('PrivacyPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
