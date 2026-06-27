import { BasePage } from './BasePage.js';

export default class ProfilePage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'ProfilePage - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('ProfilePage')}
      <div class="container mb-8">
        ${this.showEmpty('Coming Soon', 'This page is under development')}
      </div>
      ${this.createFooter()}
    `;
  }
}
