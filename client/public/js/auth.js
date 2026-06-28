// Authentication Manager
const Auth = {
  user: null,
  isAuthenticated: false,
  token: null,
  TOKEN_KEY: 'akart-auth-token',
  USER_KEY: 'akart-user',

  init() {
    const savedToken = localStorage.getItem(this.TOKEN_KEY);
    const savedUser = localStorage.getItem(this.USER_KEY);

    if (savedToken && savedUser) {
      this.token = savedToken;
      this.user = JSON.parse(savedUser);
      this.isAuthenticated = true;
    }
  },

  login(user, token) {
    this.user = user;
    this.token = token;
    this.isAuthenticated = true;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth:changed'));
  },

  logout() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.dispatchEvent(new CustomEvent('auth:changed'));
    Utils.navigate('/login');
  },

  requireLogin() {
    if (!this.isAuthenticated) {
      Utils.showToast('Please login to continue', 'warning');
      Utils.navigate('/login');
      return false;
    }
    return true;
  },

  getAuthHeader() {
    if (this.token) {
      return { 'Authorization': `Bearer ${this.token}` };
    }
    return {};
  },
};

Auth.init();
window.Auth = Auth;
