import { BasePage } from './BasePage.js';

export default class OrdersPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'My Orders - Akart';
    this.orders = [
      { id: 'ORD001', date: '2026-06-20', total: 4999, status: 'Delivered', items: 2 },
      { id: 'ORD002', date: '2026-06-15', total: 8999, status: 'In Transit', items: 3 },
    ];
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('My Orders')}

      <div class="container mb-8">
        <div class="grid-1">
          ${this.orders.map(order => `
            <div class="card">
              <div class="flex-between mb-3">
                <div>
                  <h4>Order #${order.id}</h4>
                  <p class="text-muted text-small">${order.date}</p>
                </div>
                <div style="text-align: right;">
                  <p class="font-semibold">${this.formatCurrency(order.total)}</p>
                  <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-info'}">${order.status}</span>
                </div>
              </div>
              <p class="text-muted text-small mb-3">${order.items} item(s)</p>
              <button class="btn btn-outline btn-sm">Track Order</button>
            </div>
          `).join('')}
        </div>
      </div>

      ${this.createFooter()}
    `;
  }
}
