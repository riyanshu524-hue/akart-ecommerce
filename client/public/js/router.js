// Router
const Router = {
  routes: {
    '/': 'home',
    '/login': 'login',
    '/register': 'register',
    '/products': 'products',
    '/cart': 'cart',
    '/checkout': 'checkout',
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

  async render() {
    const path = window.location.pathname;
    const page = this.routes[path] || 'notFound';
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
      } else if (page === 'cart') {
        app.innerHTML = Pages.cart();
        loadCart();
      } else if (page === 'checkout') {
        app.innerHTML = Pages.checkout();
        loadCheckout();
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
