import { BasePage } from './BasePage.js';

export default class TermsPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'TermsPage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('TermsPage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
