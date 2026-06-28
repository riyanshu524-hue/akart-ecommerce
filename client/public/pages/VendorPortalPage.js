import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';
import { uiManager } from '../js/ui.js';

export default class VendorPortalPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Vendor Portal - Akart';
    this.activeTab = 'dashboard';
    this.products = [];
    this.orders = [];
    this.earnings = 0;
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Vendor Portal')}

      <div class="container mb-8">
        <div class="grid-4-1">
          <!-- Sidebar Navigation -->
          <aside>
            <div class="card">
              <nav style="list-style: none; padding: 0;">
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.vendorPortal.switchTab('dashboard')">📊 Dashboard</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.vendorPortal.switchTab('products')">📦 Products</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.vendorPortal.switchTab('orders')">🛒 Orders</button></li>
                <li class="mb-2"><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.vendorPortal.switchTab('earnings')">💰 Earnings</button></li>
                <li><button class="btn btn-outline" style="width: 100%; text-align: left;" onclick="window.vendorPortal.switchTab('settings')">⚙️ Settings</button></li>
              </nav>
            </div>
          </aside>

          <!-- Main Content -->
          <main>
            ${this.activeTab === 'dashboard' ? this.renderDashboard() : ''}
            ${this.activeTab === 'products' ? this.renderProducts() : ''}
            ${this.activeTab === 'orders' ? this.renderOrders() : ''}
            ${this.activeTab === 'earnings' ? this.renderEarnings() : ''}
            ${this.activeTab === 'settings' ? this.renderSettings() : ''}
          </main>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }

  renderDashboard() {
    return `
      <div>
        <h2 class="mb-6">Dashboard</h2>
        <div class="grid-4 gap-4 mb-8">
          <div class="card">
            <h4 class="text-muted">Total Sales</h4>
            <h2 style="color: var(--brand-primary);">₹1,23,456</h2>
            <p class="text-muted text-small">↑ 15% this month</p>
          </div>
          <div class="card">
            <h4 class="text-muted">Total Orders</h4>
            <h2 style="color: var(--brand-primary);">234</h2>
            <p class="text-muted text-small">↑ 12 new orders</p>
          </div>
          <div class="card">
            <h4 class="text-muted">Products Listed</h4>
            <h2 style="color: var(--brand-primary);">45</h2>
            <p class="text-muted text-small">3 out of stock</p>
          </div>
          <div class="card">
            <h4 class="text-muted">Avg Rating</h4>
            <h2 style="color: var(--brand-primary);">4.8 ⭐</h2>
            <p class="text-muted text-small">Based on 156 reviews</p>
          </div>
        </div>

        <div class="grid-2 gap-4">
          <div class="card">
            <h3 class="mb-4">Recent Orders</h3>
            <table style="width: 100%; font-size: 0.9rem;">
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem;">ORD-001</td>
                <td style="padding: 0.5rem;">₹4,999</td>
                <td style="padding: 0.5rem;"><span class="badge badge-info">Pending</span></td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem;">ORD-002</td>
                <td style="padding: 0.5rem;">₹8,999</td>
                <td style="padding: 0.5rem;"><span class="badge badge-success">Shipped</span></td>
              </tr>
              <tr>
                <td style="padding: 0.5rem;">ORD-003</td>
                <td style="padding: 0.5rem;">₹2,499</td>
                <td style="padding: 0.5rem;"><span class="badge badge-success">Delivered</span></td>
              </tr>
            </table>
          </div>

          <div class="card">
            <h3 class="mb-4">Top Products</h3>
            <ul style="list-style: none; padding: 0;">
              <li class="mb-2" style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">
                <strong>Wireless Earbuds</strong>
                <p class="text-muted text-small">₹2,999 • 45 sold</p>
              </li>
              <li class="mb-2" style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">
                <strong>Phone Case</strong>
                <p class="text-muted text-small">₹499 • 123 sold</p>
              </li>
              <li style="padding: 0.5rem;">
                <strong>Screen Protector</strong>
                <p class="text-muted text-small">₹299 • 89 sold</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderProducts() {
    return `
      <div>
        <div class="flex-between mb-6">
          <h2>Products</h2>
          <button class="btn btn-primary" onclick="window.vendorPortal.showAddProduct()">+ Add Product</button>
        </div>

        <div class="grid-3">
          ${[1,2,3,4,5,6].map(i => `
            <div class="card">
              <img src="/placeholder.jpg" alt="Product" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
              <h4>Product ${i}</h4>
              <p class="text-muted text-small">₹${(i * 1000).toLocaleString()}</p>
              <div class="flex gap-2 mt-3">
                <button class="btn btn-sm btn-outline" style="flex: 1;">Edit</button>
                <button class="btn btn-sm btn-danger" style="flex: 1;">Delete</button>
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
        <h2 class="mb-6">Orders</h2>
        <div class="grid-1">
          ${[1,2,3].map(i => `
            <div class="card">
              <div class="flex-between mb-3">
                <div>
                  <h4>Order #ORD-${String(i).padStart(3, '0')}</h4>
                  <p class="text-muted text-small">2026-06-${20 + i}</p>
                </div>
                <div style="text-align: right;">
                  <p class="font-semibold">₹${(i * 5000).toLocaleString()}</p>
                  <span class="badge ${i === 1 ? 'badge-info' : 'badge-success'}">${i === 1 ? 'Pending' : 'Shipped'}</span>
                </div>
              </div>
              <p class="text-muted text-small mb-3">3 items • Customer: John Doe</p>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm">View Details</button>
                ${i === 1 ? '<button class="btn btn-primary btn-sm">Mark as Shipped</button>' : '<button class="btn btn-outline btn-sm">Track</button>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderEarnings() {
    return `
      <div>
        <h2 class="mb-6">Earnings</h2>
        <div class="grid-3 gap-4 mb-8">
          <div class="card">
            <h4 class="text-muted">Total Earnings</h4>
            <h2 style="color: var(--brand-primary);">₹1,23,456</h2>
          </div>
          <div class="card">
            <h4 class="text-muted">This Month</h4>
            <h2 style="color: var(--brand-primary);">₹45,678</h2>
          </div>
          <div class="card">
            <h4 class="text-muted">Pending Payout</h4>
            <h2 style="color: var(--brand-primary);">₹12,345</h2>
          </div>
        </div>

        <div class="card">
          <h3 class="mb-4">Earnings History</h3>
          <table style="width: 100%; font-size: 0.9rem;">
            <tr style="border-bottom: 1px solid var(--border-color);">
              <th style="text-align: left; padding: 0.5rem;">Date</th>
              <th style="text-align: left; padding: 0.5rem;">Orders</th>
              <th style="text-align: left; padding: 0.5rem;">Amount</th>
              <th style="text-align: left; padding: 0.5rem;">Commission (15%)</th>
              <th style="text-align: left; padding: 0.5rem;">Net Earnings</th>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 0.5rem;">2026-06-28</td>
              <td style="padding: 0.5rem;">12</td>
              <td style="padding: 0.5rem;">₹45,000</td>
              <td style="padding: 0.5rem;">₹6,750</td>
              <td style="padding: 0.5rem; color: var(--brand-primary); font-weight: bold;">₹38,250</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  }

  renderSettings() {
    return `
      <div>
        <h2 class="mb-6">Store Settings</h2>
        <div class="card">
          <form>
            <div class="mb-4">
              <label class="label">Store Name</label>
              <input type="text" class="input" value="My Electronics Store" required>
            </div>
            <div class="mb-4">
              <label class="label">Store Description</label>
              <textarea class="input" rows="4" required>Premium electronics and accessories</textarea>
            </div>
            <div class="mb-4">
              <label class="label">Bank Account</label>
              <input type="text" class="input" placeholder="IBAN or Account Number" required>
            </div>
            <div class="mb-4">
              <label class="label">Commission Rate</label>
              <input type="number" class="input" value="15" min="0" max="100" required> %
            </div>
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </div>
    `;
  }

  async init() {
    super.init();
    window.vendorPortal = this;
  }

  switchTab(tab) {
    this.activeTab = tab;
    window.location.reload();
  }

  showAddProduct() {
    uiManager.toast('Add product feature coming soon', 'info');
  }
}
