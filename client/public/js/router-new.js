// Router - Updated
const Router = {
  routes: {
    '/': 'home',
    '/login': 'login',
    '/register': 'register',
    '/products': 'products',
    '/product/:id': 'productDetail',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/wishlist': 'wishlist',
    '/profile': 'profile',
    '/orders': 'orders',
    '/vendor': 'vendor',
    '/admin': 'admin',
    '/terms': 'terms',
    '/privacy': 'privacy',
    '/shipping-policy': 'shipping',
    '/return-policy': 'returns',
  },

  init() {
    window.addEventListener('popstate', () => this.render());
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith('/') && !link.href.includes('://')) {
        e.preventDefault();
        this.navigate(link.pathname);
      }
    });
    this.render();
  },

  navigate(path) {
    window.history.pushState({}, '', path);
    this.render();
  },

  getRoute(path) {
    for (const [route, page] of Object.entries(this.routes)) {
      const pattern = route.replace(/:(\w+)/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(path)) return { page, params: {} };
    }
    return { page: 'notFound', params: {} };
  },

  async render() {
    const path = window.location.pathname;
    const { page } = this.getRoute(path);
    const app = document.getElementById('app');

    try {
      if (page === 'home') {
        app.innerHTML = Pages.home();
        loadHome();
      } else if (page === 'login') {
        app.innerHTML = Pages.login();
      } else if (page === 'register') {
        app.innerHTML = Pages.register();
      } else if (page === 'products') {
        app.innerHTML = Pages.products();
        loadProducts();
      } else if (page === 'productDetail') {
        const id = path.split('/')[2];
        app.innerHTML = Pages.productDetail(id);
      } else if (page === 'cart') {
        app.innerHTML = Pages.cart();
        loadCart();
      } else if (page === 'checkout') {
        app.innerHTML = Pages.checkout();
        loadCheckout();
      } else if (page === 'wishlist') {
        app.innerHTML = Pages.wishlist();
        loadWishlist();
      } else if (page === 'profile') {
        app.innerHTML = Pages.profile();
      } else if (page === 'orders') {
        app.innerHTML = Pages.orders();
        loadOrders();
      } else if (page === 'vendor') {
        if (!Auth.isAuthenticated) {
          Utils.showToast('Please login to access vendor portal', 'warning');
          Utils.navigate('/login');
          return;
        }
        app.innerHTML = Pages.vendor();
      } else if (page === 'admin') {
        if (!Auth.isAuthenticated) {
          Utils.showToast('Please login to access admin dashboard', 'warning');
          Utils.navigate('/login');
          return;
        }
        app.innerHTML = Pages.admin();
      } else if (page === 'terms') {
        app.innerHTML = Pages.createNavbar() + `
          ${Pages.createHeader('Terms & Conditions')}
          <div class="container mb-8">
            <div class="card">
              <h2>Terms & Conditions</h2>
              <p>Welcome to Akart. These terms and conditions govern your use of our platform...</p>
            </div>
          </div>
          ${Pages.createFooter()}
        `;
      } else if (page === 'privacy') {
        app.innerHTML = Pages.createNavbar() + `
          ${Pages.createHeader('Privacy Policy')}
          <div class="container mb-8">
            <div class="card">
              <h2>Privacy Policy</h2>
              <p>Your privacy is important to us. This policy explains how we collect and use your data...</p>
            </div>
          </div>
          ${Pages.createFooter()}
        `;
      } else if (page === 'shipping') {
        app.innerHTML = Pages.createNavbar() + `
          ${Pages.createHeader('Shipping Policy')}
          <div class="container mb-8">
            <div class="card">
              <h2>Shipping Policy</h2>
              <p>We offer fast and reliable shipping across India...</p>
            </div>
          </div>
          ${Pages.createFooter()}
        `;
      } else if (page === 'returns') {
        app.innerHTML = Pages.createNavbar() + `
          ${Pages.createHeader('Return & Refund Policy')}
          <div class="container mb-8">
            <div class="card">
              <h2>Return & Refund Policy</h2>
              <p>We want you to be completely satisfied with your purchase...</p>
            </div>
          </div>
          ${Pages.createFooter()}
        `;
      } else {
        app.innerHTML = Pages.notFound();
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Render error:', error);
      app.innerHTML = `<div class="container mt-8"><div class="card"><h1>Error</h1><p>${error.message}</p></div></div>`;
    }
  },
};

window.Router = Router;
