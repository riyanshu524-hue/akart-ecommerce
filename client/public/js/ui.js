/**
 * UI Manager - Common UI components and utilities
 */

export class UIManager {
  constructor() {
    this.toasts = [];
    this.modals = [];
  }

  init() {
    this.createToastContainer();
    this.createModalContainer();
  }

  createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
  }

  createModalContainer() {
    if (!document.getElementById('modal-container')) {
      const container = document.createElement('div');
      container.id = 'modal-container';
      document.body.appendChild(container);
    }
  }

  /**
   * Show toast notification
   */
  toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    
    toast.id = toastId;
    toast.className = `card ${type === 'error' ? 'border-danger' : ''}`;
    toast.style.cssText = `
      padding: 1rem;
      border-left: 4px solid;
      border-left-color: ${this.getTypeColor(type)};
      animation: slideInRight 0.3s ease-out;
      min-width: 300px;
    `;

    const icon = this.getTypeIcon(type);
    toast.innerHTML = `
      <div class="flex gap-2">
        <span style="font-size: 1.25rem;">${icon}</span>
        <span>${this.escapeHtml(message)}</span>
      </div>
    `;

    container.appendChild(toast);
    this.toasts.push(toastId);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => {
          toast.remove();
          this.toasts = this.toasts.filter(id => id !== toastId);
        }, 300);
      }, duration);
    }

    return toastId;
  }

  /**
   * Show modal dialog
   */
  modal(options = {}) {
    const {
      title = 'Dialog',
      content = '',
      buttons = [],
      onClose = null,
      size = 'md',
    } = options;

    const container = document.getElementById('modal-container');
    const modalId = `modal-${Date.now()}`;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = `${modalId}-overlay`;
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const sizeClass = {
      sm: 'max-width: 300px;',
      md: 'max-width: 500px;',
      lg: 'max-width: 800px;',
      xl: 'max-width: 1000px;',
    }[size] || 'max-width: 500px;';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = modalId;
    modal.style.cssText = `
      ${sizeClass}
      width: 90%;
      background-color: var(--bg-primary);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    `;

    let buttonsHtml = '';
    if (buttons.length > 0) {
      buttonsHtml = `
        <div class="flex gap-2 mt-6" style="justify-content: flex-end;">
          ${buttons.map(btn => `
            <button class="btn btn-${btn.variant || 'secondary'}" onclick="document.getElementById('${modalId}').close()">
              ${this.escapeHtml(btn.label)}
            </button>
          `).join('')}
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="flex-between mb-4">
        <h2>${this.escapeHtml(title)}</h2>
        <button class="btn btn-sm" onclick="document.getElementById('${modalId}-overlay').remove()" style="background: none; border: none; font-size: 1.5rem;">×</button>
      </div>
      <div>${content}</div>
      ${buttonsHtml}
    `;

    overlay.appendChild(modal);
    container.appendChild(overlay);

    // Close modal
    modal.close = () => {
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      setTimeout(() => {
        overlay.remove();
        if (onClose) onClose();
      }, 300);
    };

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        modal.close();
      }
    });

    this.modals.push(modalId);
    return modal;
  }

  /**
   * Show loading spinner
   */
  showLoading(message = 'Loading...') {
    const container = document.getElementById('app');
    container.innerHTML = `
      <div class="flex-center" style="min-height: 100vh; flex-direction: column; gap: 1rem;">
        <div class="spinner"></div>
        <p class="text-muted">${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Show error page
   */
  showError(title = 'Error', message = 'Something went wrong') {
    const container = document.getElementById('app');
    container.innerHTML = `
      <div class="container mt-8">
        <div class="card text-center">
          <h1 style="color: var(--danger); margin-bottom: 1rem;">⚠️ ${this.escapeHtml(title)}</h1>
          <p>${this.escapeHtml(message)}</p>
          <button class="btn btn-primary mt-6" onclick="history.back()">Go Back</button>
        </div>
      </div>
    `;
  }

  /**
   * Show empty state
   */
  showEmpty(title = 'No items', message = 'There are no items to display') {
    return `
      <div class="flex-center" style="min-height: 400px; flex-direction: column; gap: 1rem;">
        <div style="font-size: 3rem;">📭</div>
        <h3>${this.escapeHtml(title)}</h3>
        <p class="text-muted">${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Create a product card HTML
   */
  createProductCard(product) {
    const rating = product.rating || 0;
    const stars = '⭐'.repeat(Math.floor(rating));
    
    return `
      <div class="card-product hover-lift">
        <img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(product.name)}" class="card-product-image">
        <div class="card-product-body">
          <h4 style="margin-bottom: 0.5rem;">${this.escapeHtml(product.name)}</h4>
          <p class="text-muted text-small" style="margin-bottom: 0.5rem;">${this.escapeHtml(product.category)}</p>
          <div class="flex-between mb-2">
            <span style="font-weight: bold; color: var(--brand-primary); font-size: 1.1rem;">₹${product.price}</span>
            <span class="text-small">${stars}</span>
          </div>
          <button class="btn btn-primary" style="width: 100%;">Add to Cart</button>
        </div>
      </div>
    `;
  }

  /**
   * Create a skeleton loader
   */
  createSkeleton(count = 4) {
    return `
      <div class="grid-4">
        ${Array(count).fill(`
          <div class="card-product">
            <div class="skeleton" style="aspect-ratio: 1; border-radius: 0.75rem;"></div>
            <div class="card-product-body">
              <div class="skeleton" style="height: 1rem; margin-bottom: 0.5rem; border-radius: 0.25rem;"></div>
              <div class="skeleton" style="height: 0.75rem; width: 70%; border-radius: 0.25rem;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get type color for toast
   */
  getTypeColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return colors[type] || colors.info;
  }

  /**
   * Get type icon for toast
   */
  getTypeIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || icons.info;
  }
}

// Export singleton instance
export const uiManager = new UIManager();
