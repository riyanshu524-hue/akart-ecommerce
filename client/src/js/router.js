/**
 * Client-side router for Akart
 */

import HomePage from '../pages/HomePage.js';
import ProductsPage from '../pages/ProductsPage.js';
import ProductDetailPage from '../pages/ProductDetailPage.js';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/CheckoutPage.js';
import WishlistPage from '../pages/WishlistPage.js';
import ProfilePage from '../pages/ProfilePage.js';
import OrdersPage from '../pages/OrdersPage.js';
import OrderConfirmationPage from '../pages/OrderConfirmationPage.js';
import VendorPage from '../pages/VendorPage.js';
import AdminPage from '../pages/AdminPage.js';
import SetupWizardPage from '../pages/SetupWizardPage.js';
import TermsPage from '../pages/TermsPage.js';
import PrivacyPage from '../pages/PrivacyPage.js';
import NotFound from '../pages/NotFound.js';

class Router {
  constructor() {
    this.routes = {
      '/': HomePage,
      '/products': ProductsPage,
      '/product/:id': ProductDetailPage,
      '/cart': CartPage,
      '/checkout': CheckoutPage,
      '/wishlist': WishlistPage,
      '/profile': ProfilePage,
      '/orders': OrdersPage,
      '/order-confirmation': OrderConfirmationPage,
      '/vendor/:id': VendorPage,
      '/admin': AdminPage,
      '/setup': SetupWizardPage,
      '/terms': TermsPage,
      '/privacy': PrivacyPage,
    };
    this.currentPage = null;
  }

  async navigate(path) {
    const route = this.matchRoute(path);
    if (!route) {
      this.renderPage(NotFound, {});
      return;
    }

    const [PageClass, params] = route;
    this.renderPage(PageClass, params);
  }

  matchRoute(path) {
    const pathname = new URL(path, window.location.origin).pathname;

    for (const [pattern, PageClass] of Object.entries(this.routes)) {
      const regex = this.patternToRegex(pattern);
      const match = pathname.match(regex);
      if (match) {
        const params = this.extractParams(pattern, pathname);
        return [PageClass, params];
      }
    }
    return null;
  }

  patternToRegex(pattern) {
    const regexPattern = pattern
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^/]+)');
    return new RegExp(`^${regexPattern}$`);
  }

  extractParams(pattern, pathname) {
    const params = {};
    const patternParts = pattern.split('/').filter(p => p);
    const pathParts = pathname.split('/').filter(p => p);

    patternParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.substring(1);
        params[paramName] = pathParts[index];
      }
    });

    return params;
  }

  renderPage(PageClass, params) {
    const app = document.getElementById('app');
    if (!app) return;

    const page = new PageClass(params);
    this.currentPage = page;

    page.render().then(html => {
      app.innerHTML = html;
      page.init();
      window.scrollTo(0, 0);
    }).catch(error => {
      console.error('Error rendering page:', error);
      app.innerHTML = '<div class="container"><p>Error loading page</p></div>';
    });
  }

  start() {
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });

    // Handle initial load
    this.navigate(window.location.pathname);
  }
}

export const router = new Router();

// Override link clicks for SPA navigation
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.hostname === window.location.hostname && !link.target) {
    e.preventDefault();
    const path = link.getAttribute('href');
    window.history.pushState({}, '', path);
    router.navigate(path);
  }
});
