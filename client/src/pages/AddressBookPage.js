import { BasePage } from './BasePage.js';

export default class AddressBookPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Address Book - Akart';
    this.showForm = false;
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Address Book')}

      <div class="container mb-8">
        <div class="flex-between mb-6">
          <h2>My Addresses</h2>
          <button class="btn btn-primary" onclick="window.addressBook.toggleForm()">+ Add Address</button>
        </div>

        ${this.showForm ? this.renderForm() : ''}

        <div class="grid-2">
          ${[1,2,3].map(i => `
            <div class="card">
              <div class="flex-between mb-3">
                <h4>${i === 1 ? 'Home' : i === 2 ? 'Office' : 'Other'}</h4>
                ${i === 1 ? '<span class="badge badge-primary">Default</span>' : ''}
              </div>
              <p class="text-muted text-small mb-3">
                123 Main Street<br>
                New Delhi, Delhi 110001<br>
                India
              </p>
              <p class="text-muted text-small mb-3">Phone: +91 98765 43210</p>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm">Edit</button>
                <button class="btn btn-danger btn-sm">Delete</button>
                ${i !== 1 ? '<button class="btn btn-primary btn-sm">Set Default</button>' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${this.createFooter()}
    `;
  }

  renderForm() {
    return `
      <div class="card mb-6">
        <h3 class="mb-4">Add New Address</h3>
        <form>
          <div class="grid-2 gap-4 mb-4">
            <div>
              <label class="label">Full Name</label>
              <input type="text" class="input" required>
            </div>
            <div>
              <label class="label">Phone</label>
              <input type="tel" class="input" required>
            </div>
          </div>
          <div class="mb-4">
            <label class="label">Address</label>
            <input type="text" class="input" required>
          </div>
          <div class="grid-3 gap-4 mb-4">
            <div>
              <label class="label">City</label>
              <input type="text" class="input" required>
            </div>
            <div>
              <label class="label">State</label>
              <input type="text" class="input" required>
            </div>
            <div>
              <label class="label">Pincode</label>
              <input type="text" class="input" required>
            </div>
          </div>
          <div class="mb-4">
            <label class="label">
              <input type="checkbox"> Set as default address
            </label>
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary">Save Address</button>
            <button type="button" class="btn btn-outline" onclick="window.addressBook.toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    `;
  }

  async init() {
    super.init();
    window.addressBook = this;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    window.location.reload();
  }
}
