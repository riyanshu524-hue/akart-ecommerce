import { BasePage } from './BasePage.js';

export default class AdminDashboardPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Admin Dashboard - Akart';
    this.activeTab = 'overview';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Admin Dashboard')}

      <div class="container mb-8">
        <div class="grid-5-1">
          <aside>
            <div class="card">
              <nav style="list-style: none; padding: 0;">
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.adminDash.switchTab('overview')">📊 Overview</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.adminDash.switchTab('vendors')">🏪 Vendors</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.adminDash.switchTab('orders')">🛒 Orders</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.adminDash.switchTab('categories')">📂 Categories</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.adminDash.switchTab('users')">👥 Users</button></li>
                <li><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.adminDash.switchTab('settings')">⚙️ Settings</button></li>
              </nav>
            </div>
          </aside>

          <main>
            ${this.activeTab === 'overview' ? this.renderOverview() : ''}
            ${this.activeTab === 'vendors' ? this.renderVendors() : ''}
            ${this.activeTab === 'orders' ? this.renderOrders() : ''}
            ${this.activeTab === 'categories' ? this.renderCategories() : ''}
            ${this.activeTab === 'users' ? this.renderUsers() : ''}
            ${this.activeTab === 'settings' ? this.renderSettings() : ''}
          </main>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }

  renderOverview() {
    return `
      <div>
        <h2 class="mb-6">Platform Overview</h2>
        <div class="grid-4 gap-4 mb-8">
          <div class="card">
            <h4 class="text-muted">Total Revenue</h4>
            <h2 style="color: var(--brand-primary);">₹45,67,890</h2>
            <p class="text-muted text-small">↑ 12% from last month</p>
          </div>
          <div class="card">
            <h4 class="text-muted">Total Orders</h4>
            <h2 style="color: var(--brand-primary);">2,345</h2>
            <p class="text-muted text-small">↑ 8% from last month</p>
          </div>
          <div class="card">
            <h4 class="text-muted">Active Vendors</h4>
            <h2 style="color: var(--brand-primary);">156</h2>
            <p class="text-muted text-small">↑ 5 new vendors</p>
          </div>
          <div class="card">
            <h4 class="text-muted">Total Users</h4>
            <h2 style="color: var(--brand-primary);">12,456</h2>
            <p class="text-muted text-small">↑ 234 new users</p>
          </div>
        </div>

        <div class="grid-2 gap-4">
          <div class="card">
            <h3 class="mb-4">Recent Orders</h3>
            <table style="width: 100%; font-size: 0.9rem;">
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem;">ORD-001</td>
                <td style="padding: 0.5rem;">₹4,999</td>
                <td style="padding: 0.5rem;"><span class="badge badge-success">Delivered</span></td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem;">ORD-002</td>
                <td style="padding: 0.5rem;">₹8,999</td>
                <td style="padding: 0.5rem;"><span class="badge badge-info">In Transit</span></td>
              </tr>
            </table>
          </div>

          <div class="card">
            <h3 class="mb-4">Pending Approvals</h3>
            <ul style="list-style: none; padding: 0;">
              <li class="mb-2" style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">
                <strong>TechStore</strong>
                <p class="text-muted text-small">Electronics • Pending</p>
                <button class="btn btn-sm btn-primary">Approve</button>
              </li>
              <li style="padding: 0.5rem;">
                <strong>FashionHub</strong>
                <p class="text-muted text-small">Clothing • Pending</p>
                <button class="btn btn-sm btn-primary">Approve</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderVendors() {
    return `
      <div>
        <h2 class="mb-6">Vendor Management</h2>
        <div class="grid-1">
          ${[1,2,3].map(i => `
            <div class="card">
              <div class="flex-between mb-3">
                <div>
                  <h4>Vendor ${i}</h4>
                  <p class="text-muted text-small">Electronics Store</p>
                </div>
                <div>
                  <span class="badge ${i === 1 ? 'badge-warning' : 'badge-success'}">${i === 1 ? 'Pending' : 'Approved'}</span>
                </div>
              </div>
              <p class="text-muted text-small mb-3">Revenue: ₹${(i * 100000).toLocaleString()} • Products: ${i * 20}</p>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm">View Details</button>
                ${i === 1 ? '<button class="btn btn-primary btn-sm">Approve</button>' : '<button class="btn btn-danger btn-sm">Suspend</button>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderOrders() {
    return `
      <div>
        <h2 class="mb-6">Order Management</h2>
        <table style="width: 100%; font-size: 0.9rem;">
          <tr style="border-bottom: 2px solid var(--border-color);">
            <th style="text-align: left; padding: 1rem;">Order ID</th>
            <th style="text-align: left; padding: 1rem;">Customer</th>
            <th style="text-align: left; padding: 1rem;">Amount</th>
            <th style="text-align: left; padding: 1rem;">Status</th>
            <th style="text-align: left; padding: 1rem;">Action</th>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem;">ORD-001</td>
            <td style="padding: 1rem;">John Doe</td>
            <td style="padding: 1rem;">₹4,999</td>
            <td style="padding: 1rem;"><span class="badge badge-success">Delivered</span></td>
            <td style="padding: 1rem;"><button class="btn btn-sm btn-outline">View</button></td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem;">ORD-002</td>
            <td style="padding: 1rem;">Jane Smith</td>
            <td style="padding: 1rem;">₹8,999</td>
            <td style="padding: 1rem;"><span class="badge badge-info">In Transit</span></td>
            <td style="padding: 1rem;"><button class="btn btn-sm btn-outline">View</button></td>
          </tr>
        </table>
      </div>
    `;
  }

  renderCategories() {
    return `
      <div>
        <div class="flex-between mb-6">
          <h2>Categories</h2>
          <button class="btn btn-primary">+ Add Category</button>
        </div>
        <table style="width: 100%; font-size: 0.9rem;">
          <tr style="border-bottom: 2px solid var(--border-color);">
            <th style="text-align: left; padding: 1rem;">Name</th>
            <th style="text-align: left; padding: 1rem;">Products</th>
            <th style="text-align: left; padding: 1rem;">Action</th>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem;">Electronics</td>
            <td style="padding: 1rem;">234</td>
            <td style="padding: 1rem;"><button class="btn btn-sm btn-outline">Edit</button></td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem;">Fashion</td>
            <td style="padding: 1rem;">567</td>
            <td style="padding: 1rem;"><button class="btn btn-sm btn-outline">Edit</button></td>
          </tr>
        </table>
      </div>
    `;
  }

  renderUsers() {
    return `
      <div>
        <h2 class="mb-6">User Management</h2>
        <table style="width: 100%; font-size: 0.9rem;">
          <tr style="border-bottom: 2px solid var(--border-color);">
            <th style="text-align: left; padding: 1rem;">Name</th>
            <th style="text-align: left; padding: 1rem;">Email</th>
            <th style="text-align: left; padding: 1rem;">Orders</th>
            <th style="text-align: left; padding: 1rem;">Action</th>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem;">John Doe</td>
            <td style="padding: 1rem;">john@example.com</td>
            <td style="padding: 1rem;">5</td>
            <td style="padding: 1rem;"><button class="btn btn-sm btn-outline">View</button></td>
          </tr>
          <tr>
            <td style="padding: 1rem;">Jane Smith</td>
            <td style="padding: 1rem;">jane@example.com</td>
            <td style="padding: 1rem;">3</td>
            <td style="padding: 1rem;"><button class="btn btn-sm btn-outline">View</button></td>
          </tr>
        </table>
      </div>
    `;
  }

  renderSettings() {
    return `
      <div>
        <h2 class="mb-6">Platform Settings</h2>
        <div class="card">
          <form>
            <div class="mb-4">
              <label class="label">Platform Name</label>
              <input type="text" class="input" value="Akart" required>
            </div>
            <div class="mb-4">
              <label class="label">Vendor Commission (%)</label>
              <input type="number" class="input" value="15" min="0" max="100" required>
            </div>
            <div class="mb-4">
              <label class="label">Support Email</label>
              <input type="email" class="input" value="support@akart.com" required>
            </div>
            <div class="mb-4">
              <label class="label">Currency</label>
              <select class="input" required>
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </div>
    `;
  }

  async init() {
    super.init();
    window.adminDash = this;
  }

  switchTab(tab) {
    this.activeTab = tab;
    window.location.reload();
  }
}
