/**
 * NotFound Page - 404 Error Page
 */

import { BasePage } from './BasePage.js';

export default class NotFound extends BasePage {
  constructor(params) {
    super(params);
    this.title = '404 - Page Not Found - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Page Not Found')}

      <div class="container mb-8">
        <div class="card text-center" style="padding: 4rem 2rem;">
          <h1 style="font-size: 5rem; margin-bottom: 1rem;">404</h1>
          <h2 style="margin-bottom: 1rem;">Oops! Page Not Found</h2>
          <p style="margin-bottom: 2rem; color: var(--text-muted);">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-primary" onclick="window.location.href='/'">
              Go to Home
            </button>
            <button class="btn btn-outline" onclick="window.history.back()">
              Go Back
            </button>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
