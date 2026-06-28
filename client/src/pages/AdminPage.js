import { BasePage } from './BasePage.js';

export default class AdminPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Admin Dashboard - Akart';
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Admin Dashboard')}

      <div class="container mb-8">
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
            <h4 class="text-muted">Total Vendors</h4>
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
                <td style="padding: 0.5rem;">ORD001</td>
                <td style="padding: 0.5rem;">₹4,999</td>
                <td style="padding: 0.5rem;"><span class="badge badge-success">Delivered</span></td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem;">ORD002</td>
                <td style="padding: 0.5rem;">₹8,999</td>
                <td style="padding: 0.5rem;"><span class="badge badge-info">In Transit</span></td>
              </tr>
            </table>
          </div>

          <div class="card">
            <h3 class="mb-4">Pending Vendors</h3>
            <table style="width: 100%; font-size: 0.9rem;">
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem;">TechStore</td>
                <td style="padding: 0.5rem;"><button class="btn btn-sm btn-primary">Approve</button></td>
              </tr>
              <tr>
                <td style="padding: 0.5rem;">FashionHub</td>
                <td style="padding: 0.5rem;"><button class="btn btn-sm btn-primary">Approve</button></td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
