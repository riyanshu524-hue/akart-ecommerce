import { BasePage } from './BasePage.js';

export default class SetupWizard extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'SetupWizard - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('SetupWizard')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
