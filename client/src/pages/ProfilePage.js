import { BasePage } from './BasePage.js';
import { uiManager } from '../js/ui.js';

export default class ProfilePage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'My Profile - Akart';
    this.user = { name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210' };
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('My Profile')}

      <div class="container mb-8">
        <div class="grid-3-1">
          <main>
            <div class="card mb-4">
              <h3 class="mb-4">Personal Information</h3>
              <form>
                <div class="mb-4">
                  <label class="label">Full Name</label>
                  <input type="text" class="input" value="${this.escapeHtml(this.user.name)}" required>
                </div>
                <div class="mb-4">
                  <label class="label">Email</label>
                  <input type="email" class="input" value="${this.escapeHtml(this.user.email)}" required>
                </div>
                <div class="mb-4">
                  <label class="label">Phone</label>
                  <input type="tel" class="input" value="${this.escapeHtml(this.user.phone)}" required>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>

            <div class="card">
              <h3 class="mb-4">Change Password</h3>
              <form>
                <div class="mb-4">
                  <label class="label">Current Password</label>
                  <input type="password" class="input" required>
                </div>
                <div class="mb-4">
                  <label class="label">New Password</label>
                  <input type="password" class="input" required>
                </div>
                <div class="mb-4">
                  <label class="label">Confirm Password</label>
                  <input type="password" class="input" required>
                </div>
                <button type="submit" class="btn btn-primary">Update Password</button>
              </form>
            </div>
          </main>

          <aside>
            <div class="card mb-4">
              <h3 class="mb-4">Quick Links</h3>
              <ul style="list-style: none; padding: 0;">
                <li class="mb-2"><a href="/orders" class="btn btn-outline" style="width: 100%; text-align: left;">📦 My Orders</a></li>
                <li class="mb-2"><a href="/addresses" class="btn btn-outline" style="width: 100%; text-align: left;">📍 Addresses</a></li>
                <li class="mb-2"><a href="/wishlist" class="btn btn-outline" style="width: 100%; text-align: left;">❤️ Wishlist</a></li>
                <li class="mb-2"><a href="/settings" class="btn btn-outline" style="width: 100%; text-align: left;">⚙️ Settings</a></li>
              </ul>
            </div>

            <div class="card">
              <h3 class="mb-4">Account</h3>
              <button class="btn btn-danger" style="width: 100%;" onclick="if(confirm('Are you sure?')) window.location.href='/logout'">Logout</button>
            </div>
          </aside>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
