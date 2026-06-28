// Page Handlers and Razorpay Integration

async function loadHome() {
  try {
    const data = await API.get('/categories');
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (data.categories && data.categories.length > 0) {
      categoriesContainer.innerHTML = data.categories.map(cat => `
        <div class="card text-center" style="cursor: pointer;" onclick="Utils.navigate('/products?category=${cat.id}')">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📦</div>
          <h4>${cat.name}</h4>
        </div>
      `).join('');
    }

    const productsData = await API.get('/products?limit=8');
    const productsContainer = document.getElementById('productsContainer');
    if (productsData.products && productsData.products.length > 0) {
      productsContainer.innerHTML = productsData.products.map(prod => `
        <div class="card" style="cursor: pointer;" onclick="Utils.navigate('/product/${prod.id}')">
          <div style="background: var(--bg-secondary); height: 200px; border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 3rem;">📦</span>
          </div>
          <h4>${prod.name}</h4>
          <p style="color: var(--text-muted); margin: 0.5rem 0;">${prod.description?.substring(0, 50)}...</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <strong>${Utils.formatCurrency(prod.price)}</strong>
            <button class="btn btn-sm btn-primary" onclick="addToCart(${prod.id}); event.stopPropagation();">Add</button>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading home:', error);
  }
}

async function loadProducts() {
  try {
    const data = await API.get('/products');
    const productsGrid = document.getElementById('productsGrid');
    if (data.products && data.products.length > 0) {
      productsGrid.innerHTML = data.products.map(prod => `
        <div class="card" style="cursor: pointer;" onclick="Utils.navigate('/product/${prod.id}')">
          <div style="background: var(--bg-secondary); height: 200px; border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 3rem;">📦</span>
          </div>
          <h4>${prod.name}</h4>
          <p style="color: var(--text-muted); margin: 0.5rem 0; font-size: 0.9rem;">${prod.description?.substring(0, 40)}...</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <div>
              <strong>${Utils.formatCurrency(prod.price)}</strong>
              <p style="color: var(--text-muted); font-size: 0.8rem; margin: 0;">⭐ ${prod.rating || 4.5}</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="addToCart(${prod.id}); event.stopPropagation();">Add</button>
          </div>
        </div>
      `).join('');
    }

    const categoryFilter = document.getElementById('categoryFilter');
    const categoriesData = await API.get('/categories');
    if (categoriesData.categories) {
      categoryFilter.innerHTML += categoriesData.categories.map(cat => `
        <option value="${cat.id}">${cat.name}</option>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function addToCart(productId) {
  if (!Auth.isAuthenticated) {
    Utils.showToast('Please login to add items to cart', 'warning');
    Utils.navigate('/login');
    return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  Utils.showToast('Added to cart!', 'success');
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartItems = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty. <a href="/products" style="color: var(--brand-primary);">Continue shopping</a></p>';
    return;
  }

  let subtotal = 0;
  cartItems.innerHTML = cart.map(item => {
    const price = 999; // Mock price
    subtotal += price * item.quantity;
    return `
      <div class="card mb-3">
        <div class="flex-between">
          <div>
            <h4>Product ${item.productId}</h4>
            <p style="color: var(--text-muted);">${Utils.formatCurrency(price)} x ${item.quantity}</p>
          </div>
          <div>
            <strong>${Utils.formatCurrency(price * item.quantity)}</strong>
            <button class="btn btn-sm btn-outline" onclick="removeFromCart(${item.productId})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const shipping = 50;
  const total = subtotal + shipping;
  
  document.getElementById('subtotal').textContent = Utils.formatCurrency(subtotal);
  document.getElementById('shipping').textContent = Utils.formatCurrency(shipping);
  document.getElementById('total').textContent = Utils.formatCurrency(total);
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(i => i.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  Utils.showToast('Removed from cart', 'info');
}

function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += 999 * item.quantity;
  });
  const shipping = 50;
  const total = subtotal + shipping;

  const summary = document.getElementById('checkoutSummary');
  summary.innerHTML = `
    <div class="mb-3 flex-between">
      <span>Subtotal</span>
      <span>${Utils.formatCurrency(subtotal)}</span>
    </div>
    <div class="mb-3 flex-between">
      <span>Shipping</span>
      <span>${Utils.formatCurrency(shipping)}</span>
    </div>
    <div class="mb-3 flex-between" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
      <strong>Total</strong>
      <strong style="font-size: 1.2rem;">${Utils.formatCurrency(total)}</strong>
    </div>
  `;
}

async function processPayment() {
  if (!Auth.isAuthenticated) {
    Utils.showToast('Please login to continue', 'warning');
    Utils.navigate('/login');
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    Utils.showToast('Your cart is empty', 'warning');
    return;
  }

  UI.showLoading('Processing payment...');

  try {
    // Create order
    const orderData = await API.post('/payments/create-order', {
      amount: 50000, // Mock amount in paise
      currency: 'INR',
      paymentMethod,
    });

    UI.hideLoading();

    // Initialize Razorpay
    const options = {
      key: 'rzp_test_T6hm4bnUhKQOnp',
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.id,
      handler: async function(response) {
        try {
          const verifyData = await API.post('/payments/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyData.success) {
            Utils.showToast('Payment successful!', 'success');
            localStorage.removeItem('cart');
            setTimeout(() => Utils.navigate('/order-confirmation/' + verifyData.orderId), 1500);
          }
        } catch (error) {
          Utils.showToast('Payment verification failed', 'error');
        }
      },
      prefill: {
        name: Auth.user?.name || '',
        email: Auth.user?.email || '',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    UI.hideLoading();
    Utils.showToast('Payment failed: ' + error.message, 'error');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  UI.showLoading('Logging in...');

  try {
    const data = await API.post('/auth/login', { email, password });
    Auth.login(data.user, data.token);
    UI.hideLoading();
    Utils.showToast('Logged in successfully!', 'success');
    setTimeout(() => Utils.navigate('/'), 1000);
  } catch (error) {
    UI.hideLoading();
    Utils.showToast('Login failed: ' + error.message, 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    Utils.showToast('Passwords do not match', 'error');
    return;
  }

  UI.showLoading('Creating account...');

  try {
    const data = await API.post('/auth/register', { name, email, password });
    Auth.login(data.user, data.token);
    UI.hideLoading();
    Utils.showToast('Account created successfully!', 'success');
    setTimeout(() => Utils.navigate('/'), 1000);
  } catch (error) {
    UI.hideLoading();
    Utils.showToast('Registration failed: ' + error.message, 'error');
  }
}

function filterProducts() {
  const category = document.getElementById('categoryFilter')?.value;
  const price = document.getElementById('priceFilter')?.value;
  const sort = document.getElementById('sortFilter')?.value;

  let url = '/products?';
  if (category) url += `category=${category}&`;
  if (price) url += `maxPrice=${price}&`;
  if (sort) url += `sort=${sort}`;

  Utils.navigate(url);
  loadProducts();
}

// Load Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
document.head.appendChild(script);

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  Router.init();
});

if (document.readyState !== 'loading') {
  Router.init();
}
