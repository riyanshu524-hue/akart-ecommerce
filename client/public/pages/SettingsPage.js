import { BasePage } from './BasePage.js';

export default class SettingsPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Settings - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Account Settings')}

      <div class="container mb-8">
        <div class="grid-3-1">
          <div>
            <div class="card mb-4">
              <h3 class="mb-4">Personal Information</h3>
              <form>
                <div class="mb-4">
                  <label class="label">Full Name</label>
                  <input type="text" class="input" value="John Doe" required>
                </div>
                <div class="mb-4">
                  <label class="label">Email</label>
                  <input type="email" class="input" value="john@example.com" required>
                </div>
                <div class="mb-4">
                  <label class="label">Phone</label>
                  <input type="tel" class="input" value="+91 98765 43210" required>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>

            <div class="card mb-4">
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

            <div class="card">
              <h3 class="mb-4">Preferences</h3>
              <form>
                <div class="mb-4">
                  <label class="label">
                    <input type="checkbox" checked> Email Notifications
                  </label>
                </div>
                <div class="mb-4">
                  <label class="label">
                    <input type="checkbox" checked> Order Updates
                  </label>
                </div>
                <div class="mb-4">
                  <label class="label">
                    <input type="checkbox"> Marketing Emails
                  </label>
                </div>
                <button type="submit" class="btn btn-primary">Save Preferences</button>
              </form>
            </div>
          </div>

          <aside>
            <div class="card">
              <h3 class="mb-4">Account</h3>
              <ul style="list-style: none; padding: 0;">
                <li class="mb-2"><a href="#" class="text-link">Profile</a></li>
                <li class="mb-2"><a href="#" class="text-link">Addresses</a></li>
                <li class="mb-2"><a href="#" class="text-link">Payment Methods</a></li>
                <li class="mb-2"><a href="#" class="text-link">Order History</a></li>
                <li class="mb-2"><a href="#" class="text-link">Wishlist</a></li>
                <li><a href="#" class="text-link text-danger">Delete Account</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
