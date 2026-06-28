import { BasePage } from './BasePage.js';

export default class RegisterPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Register - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      <div class="container" style="max-width: 400px; margin: 4rem auto;">
        <div class="card">
          <h1 class="mb-6 text-center">Create Account</h1>
          <form id="registerForm">
            <div class="mb-4">
              <label class="label">Full Name</label>
              <input type="text" class="input" id="name" required>
            </div>
            <div class="mb-4">
              <label class="label">Email Address</label>
              <input type="email" class="input" id="email" required>
            </div>
            <div class="mb-4">
              <label class="label">Password</label>
              <input type="password" class="input" id="password" required>
            </div>
            <div class="mb-4">
              <label class="label">Confirm Password</label>
              <input type="password" class="input" id="confirmPassword" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block mb-4">Create Account</button>
            <p class="text-center">Already have an account? <a href="/login" class="text-link">Login here</a></p>
          </form>
        </div>
      </div>
      ${this.createFooter()}
    `;
  }

  async init() {
    super.init();
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Registration functionality will be implemented with backend integration');
    });
  }
}
