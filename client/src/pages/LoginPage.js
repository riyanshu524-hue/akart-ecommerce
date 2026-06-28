import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';

export default class LoginPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Login - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      <div class="container" style="max-width: 400px; margin: 4rem auto;">
        <div class="card">
          <h1 class="mb-6 text-center">Login to Akart</h1>
          <form id="loginForm">
            <div class="mb-4">
              <label class="label">Email Address</label>
              <input type="email" class="input" id="email" required>
            </div>
            <div class="mb-4">
              <label class="label">Password</label>
              <input type="password" class="input" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block mb-4">Login</button>
            <p class="text-center">Don't have an account? <a href="/register" class="text-link">Register here</a></p>
          </form>
        </div>
      </div>
      ${this.createFooter()}
    `;
  }

  async init() {
    super.init();
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login functionality will be implemented with backend integration');
    });
  }
}
