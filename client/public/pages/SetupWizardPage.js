import { BasePage } from './BasePage.js';

export default class SetupWizardPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Setup Wizard - Akart';
    this.step = 1;
  }

  async render() {
    return `
      ${this.createNavbar()}
      ${this.createHeader('Platform Setup Wizard')}

      <div class="container mb-8" style="max-width: 600px; margin-left: auto; margin-right: auto;">
        <div class="card">
          <div class="flex-between mb-6">
            <h3>Step ${this.step} of 4</h3>
            <div style="width: ${this.step * 25}%; height: 4px; background: var(--brand-primary); border-radius: 2px;"></div>
          </div>

          ${this.step === 1 ? `
            <h4 class="mb-4">Store Name & Tagline</h4>
            <form>
              <div class="mb-4">
                <label class="label">Store Name</label>
                <input type="text" class="input" placeholder="e.g., Akart" required>
              </div>
              <div class="mb-4">
                <label class="label">Tagline</label>
                <input type="text" class="input" placeholder="e.g., Shop Everything" required>
              </div>
              <button type="button" class="btn btn-primary" style="width: 100%;" onclick="window.setupWizard.nextStep()">Next</button>
            </form>
          ` : ''}

          ${this.step === 2 ? `
            <h4 class="mb-4">Store Logo & Colors</h4>
            <form>
              <div class="mb-4">
                <label class="label">Logo Upload</label>
                <input type="file" class="input" accept="image/*" required>
              </div>
              <div class="mb-4">
                <label class="label">Primary Color</label>
                <input type="color" class="input" value="#2563eb" required>
              </div>
              <div class="mb-4">
                <label class="label">Secondary Color</label>
                <input type="color" class="input" value="#f59e0b" required>
              </div>
              <div class="flex gap-2">
                <button type="button" class="btn btn-outline" style="flex: 1;" onclick="window.setupWizard.prevStep()">Back</button>
                <button type="button" class="btn btn-primary" style="flex: 1;" onclick="window.setupWizard.nextStep()">Next</button>
              </div>
            </form>
          ` : ''}

          ${this.step === 3 ? `
            <h4 class="mb-4">Currency & Commission</h4>
            <form>
              <div class="mb-4">
                <label class="label">Currency</label>
                <select class="input" required>
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="label">Vendor Commission (%)</label>
                <input type="number" class="input" value="15" min="0" max="100" required>
              </div>
              <div class="flex gap-2">
                <button type="button" class="btn btn-outline" style="flex: 1;" onclick="window.setupWizard.prevStep()">Back</button>
                <button type="button" class="btn btn-primary" style="flex: 1;" onclick="window.setupWizard.nextStep()">Next</button>
              </div>
            </form>
          ` : ''}

          ${this.step === 4 ? `
            <h4 class="mb-4">Review & Complete</h4>
            <div class="card" style="background-color: var(--bg-secondary); margin-bottom: 2rem;">
              <p><strong>Store Name:</strong> Akart</p>
              <p><strong>Tagline:</strong> Shop Everything</p>
              <p><strong>Currency:</strong> INR</p>
              <p><strong>Commission:</strong> 15%</p>
            </div>
            <div class="flex gap-2">
              <button type="button" class="btn btn-outline" style="flex: 1;" onclick="window.setupWizard.prevStep()">Back</button>
              <button type="button" class="btn btn-primary" style="flex: 1;" onclick="window.setupWizard.complete()">Complete Setup</button>
            </div>
          ` : ''}
        </div>
      </div>

      ${this.createFooter()}
    `;
  }

  async init() {
    super.init();
    window.setupWizard = this;
  }

  nextStep() {
    this.step = Math.min(4, this.step + 1);
    window.location.reload();
  }

  prevStep() {
    this.step = Math.max(1, this.step - 1);
    window.location.reload();
  }

  complete() {
    alert('Setup completed! Your platform is ready.');
    window.location.href = '/admin';
  }
}
