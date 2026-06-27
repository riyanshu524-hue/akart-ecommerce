/**
 * Akart E-Commerce Platform - Main Application Entry Point
 * Vanilla JS, no frameworks
 */

import { Router } from './router.js';
import { ThemeManager } from './theme.js';
import { AuthManager } from './auth.js';
import { UIManager } from './ui.js';

class AkartApp {
  constructor() {
    this.router = new Router();
    this.themeManager = new ThemeManager();
    this.authManager = new AuthManager();
    this.uiManager = new UIManager();
    this.initialized = false;
  }

  async init() {
    console.log('🚀 Initializing Akart E-Commerce Platform...');

    try {
      // Initialize theme
      this.themeManager.init();
      console.log('✓ Theme manager initialized');

      // Initialize auth
      await this.authManager.init();
      console.log('✓ Auth manager initialized');

      // Initialize UI
      this.uiManager.init();
      console.log('✓ UI manager initialized');

      // Setup router
      this.router.init();
      console.log('✓ Router initialized');

      // Load initial page
      await this.router.navigate(window.location.pathname);

      this.initialized = true;
      console.log('✅ Akart Platform ready!');

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('akart:ready'));
    } catch (error) {
      console.error('❌ Failed to initialize Akart:', error);
      this.showErrorPage(error);
    }
  }

  showErrorPage(error) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="flex-center" style="min-height: 100vh; flex-direction: column; gap: 2rem;">
        <div style="text-align: center;">
          <h1>⚠️ Initialization Error</h1>
          <p>${error.message}</p>
          <button class="btn btn-primary mt-4" onclick="location.reload()">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new AkartApp();
    app.init();
  });
} else {
  const app = new AkartApp();
  app.init();
}

// Export for global access
window.Akart = { App: AkartApp };
