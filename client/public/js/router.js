import HomePage from '../pages/HomePage.js';
import ProductsPage from '../pages/ProductsPage.js';
import ProductDetailPage from '../pages/ProductDetailPage.js';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/CheckoutPage.js';
import WishlistPage from '../pages/WishlistPage.js';
import ProfilePage from '../pages/ProfilePage.js';
import OrdersPage from '../pages/OrdersPage.js';
import OrderConfirmationPage from '../pages/OrderConfirmationPage.js';
import VendorPortalPage from '../pages/VendorPortalPage.js';
import AdminDashboardPage from '../pages/AdminDashboardPage.js';
import SetupWizardPage from '../pages/SetupWizardPage.js';
import TermsPage from '../pages/TermsPage.js';
import PrivacyPage from '../pages/PrivacyPage.js';
import ReturnRefundPolicyPage from '../pages/ReturnRefundPolicyPage.js';
import ShippingPolicyPage from '../pages/ShippingPolicyPage.js';
import SettingsPage from '../pages/SettingsPage.js';
import AddressBookPage from '../pages/AddressBookPage.js';
import PaymentMethodsPage from '../pages/PaymentMethodsPage.js';
import VendorPage from '../pages/VendorPage.js';
import NotFound from '../pages/NotFound.js';

const routes = {
  '/': HomePage,
  '/products': ProductsPage,
  '/product/:id': ProductDetailPage,
  '/cart': CartPage,
  '/checkout': CheckoutPage,
  '/wishlist': WishlistPage,
  '/profile': ProfilePage,
  '/orders': OrdersPage,
  '/order-confirmation/:id': OrderConfirmationPage,
  '/vendor-portal': VendorPortalPage,
  '/admin': AdminDashboardPage,
  '/setup': SetupWizardPage,
  '/terms': TermsPage,
  '/privacy': PrivacyPage,
  '/return-policy': ReturnRefundPolicyPage,
  '/shipping-policy': ShippingPolicyPage,
  '/settings': SettingsPage,
  '/addresses': AddressBookPage,
  '/payment-methods': PaymentMethodsPage,
  '/vendor/:id': VendorPage,
};

function getRoute(path) {
  for (const [pattern, component] of Object.entries(routes)) {
    const regex = pattern
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '(?<$1>[^\\/]+)');
    
    const match = new RegExp(`^${regex}$`).exec(path);
    if (match) {
      return { component, params: match.groups || {} };
    }
  }
  
  return { component: NotFound, params: {} };
}

export class Router {
  constructor() {
    this.currentPage = null;
    this.appContainer = document.getElementById('app');
  }

  init() {
    // Handle popstate for back/forward buttons
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });

    // Handle link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith('/') && !link.href.includes('://')) {
        e.preventDefault();
        this.navigate(link.href);
      }
    });
  }

  async navigate(path) {
    try {
      const { component, params } = getRoute(path);
      
      // Create new page instance
      const page = new component(params);
      
      // Render page
      const html = await page.render();
      this.appContainer.innerHTML = html;
      
      // Initialize page
      if (page.init) {
        await page.init();
      }
      
      // Update browser history
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      
      // Update page title
      document.title = page.title || 'Akart';
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      this.currentPage = page;
    } catch (error) {
      console.error('Navigation error:', error);
      this.appContainer.innerHTML = `
        <div class="container mt-8">
          <div class="card">
            <h1>Error Loading Page</h1>
            <p>${error.message}</p>
            <button class="btn btn-primary" onclick="window.location.href='/'">Go Home</button>
          </div>
        </div>
      `;
    }
  }
}

export default routes;
