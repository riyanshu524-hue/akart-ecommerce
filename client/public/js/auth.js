/**
 * Auth Manager - Handle authentication and user sessions
 */

export class AuthManager {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.token = null;
    this.TOKEN_KEY = 'akart-auth-token';
    this.USER_KEY = 'akart-user';
  }

  async init() {
    // Try to restore session from localStorage
    const savedToken = localStorage.getItem(this.TOKEN_KEY);
    const savedUser = localStorage.getItem(this.USER_KEY);

    if (savedToken && savedUser) {
      try {
        this.token = savedToken;
        this.user = JSON.parse(savedUser);
        this.isAuthenticated = true;
        
        // Verify token is still valid
        await this.verifyToken();
      } catch (error) {
        console.warn('Failed to restore session:', error);
        this.clearSession();
      }
    }
  }

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.setSession(data.token, data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      this.setSession(data.token, data.user);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  async verifyToken() {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${this.token}` },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      this.user = data.user;
      return true;
    } catch (error) {
      console.warn('Token verification failed:', error);
      this.clearSession();
      return false;
    }
  }

  setSession(token, user) {
    this.token = token;
    this.user = user;
    this.isAuthenticated = true;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user, isAuthenticated: true } }));
  }

  clearSession() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: null, isAuthenticated: false } }));
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return this.isAuthenticated && !!this.token;
  }

  getAuthHeader() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  hasRole(role) {
    return this.user && this.user.role === role;
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  isVendor() {
    return this.hasRole('vendor');
  }

  isCustomer() {
    return this.hasRole('customer') || (this.user && !this.user.role);
  }
}

// Export singleton instance
export const authManager = new AuthManager();
