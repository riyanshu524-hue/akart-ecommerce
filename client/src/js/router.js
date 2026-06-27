/**
 * Router - Client-side routing without frameworks
 */

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentParams = {};
    this.setupRoutes();
  }

  setupRoutes() {
    // Define all routes
    this.routes.set('/', { name: 'home', component: 'HomePage' });
    this.routes.set('/products', { name: 'products', component: 'ProductsPage' });
    this.routes.set('/product/:id', { name: 'product-detail', component: 'ProductDetailPage' });
    this.routes.set('/cart', { name: 'cart', component: 'CartPage' });
    this.routes.set('/checkout', { name: 'checkout', component: 'CheckoutPage' });
    this.routes.set('/profile', { name: 'profile', component: 'ProfilePage' });
    this.routes.set('/orders', { name: 'orders', component: 'OrdersPage' });
    this.routes.set('/vendor', { name: 'vendor-dashboard', component: 'VendorDashboard' });
    this.routes.set('/admin', { name: 'admin-dashboard', component: 'AdminDashboard' });
    this.routes.set('/setup', { name: 'setup-wizard', component: 'SetupWizard' });
    this.routes.set('/terms', { name: 'terms', component: 'TermsPage' });
    this.routes.set('/privacy', { name: 'privacy', component: 'PrivacyPage' });
    this.routes.set('/refund', { name: 'refund', component: 'RefundPage' });
  }

  init() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.navigate(window.location.pathname, false);
    });

    // Handle link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.target) {
        e.preventDefault();
        this.navigate(link.href.replace(window.location.origin, ''));
      }
    });
  }

  async navigate(path, pushState = true) {
    console.log(`🔗 Navigating to: ${path}`);

    // Parse path and params
    const route = this.matchRoute(path);
    if (!route) {
      console.warn(`⚠️ Route not found: ${path}`);
      this.show404();
      return;
    }

    // Update browser history
    if (pushState) {
      window.history.pushState({ path }, '', path);
    }

    this.currentRoute = route;
    await this.renderPage(route);
  }

  matchRoute(path) {
    // Exact match
    if (this.routes.has(path)) {
      return { ...this.routes.get(path), path };
    }

    // Parameterized match
    for (const [routePath, route] of this.routes) {
      const params = this.matchParams(routePath, path);
      if (params) {
        this.currentParams = params;
        return { ...route, path, params };
      }
    }

    return null;
  }

  matchParams(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].substring(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return params;
  }

  async renderPage(route) {
    const app = document.getElementById('app');
    
    try {
      // Show loading state
      app.innerHTML = '<div class="flex-center" style="min-height: 100vh;"><div class="spinner"></div></div>';

      // Dynamic import page component
      const module = await import(`../pages/${route.component}.js`);
      const PageClass = module.default;
      const page = new PageClass(route.params || {});

      // Render page
      const content = await page.render();
      app.innerHTML = content;

      // Call page init if exists
      if (page.init) {
        await page.init();
      }

      // Scroll to top
      window.scrollTo(0, 0);

      console.log(`✓ Page rendered: ${route.name}`);
    } catch (error) {
      console.error('Error rendering page:', error);
      app.innerHTML = `
        <div class="container mt-8">
          <div class="card">
            <h1>Error Loading Page</h1>
            <p>${error.message}</p>
            <button class="btn btn-primary mt-4" onclick="history.back()">Go Back</button>
          </div>
        </div>
      `;
    }
  }

  show404() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container mt-8">
        <div class="card text-center">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
          <h2>Page Not Found</h2>
          <p class="text-muted mt-4">The page you're looking for doesn't exist.</p>
          <a href="/" class="btn btn-primary mt-6">Go Home</a>
        </div>
      </div>
    `;
  }

  push(path) {
    this.navigate(path, true);
  }

  replace(path) {
    this.navigate(path, false);
  }

  back() {
    window.history.back();
  }
}

// Export router instance
export const router = new Router();
