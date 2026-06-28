/**
 * Theme Manager - Dark/Light mode support with localStorage persistence
 */

export class ThemeManager {
  constructor() {
    this.THEME_KEY = 'akart-theme';
    this.THEMES = {
      LIGHT: 'light',
      DARK: 'dark',
    };
    this.currentTheme = this.THEMES.LIGHT;
  }

  init() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    // Check system preference if no saved theme
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? this.THEMES.DARK : this.THEMES.LIGHT;
    } else {
      this.currentTheme = savedTheme;
    }

    // Apply theme
    this.applyTheme(this.currentTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.setTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
      }
    });
  }

  applyTheme(theme) {
    const body = document.body;
    
    if (theme === this.THEMES.DARK) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }

    this.currentTheme = theme;
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  setTheme(theme) {
    if (!Object.values(this.THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === this.THEMES.LIGHT 
      ? this.THEMES.DARK 
      : this.THEMES.LIGHT;
    this.setTheme(newTheme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  isDarkMode() {
    return this.currentTheme === this.THEMES.DARK;
  }

  /**
   * Set brand colors dynamically from store settings
   */
  setBrandColors(colors) {
    const root = document.documentElement;
    
    if (colors.primary) {
      root.style.setProperty('--brand-primary', colors.primary);
      // Calculate dark variant
      const darkVariant = this.darkenColor(colors.primary, 0.2);
      root.style.setProperty('--brand-primary-dark', darkVariant);
    }

    if (colors.secondary) {
      root.style.setProperty('--brand-secondary', colors.secondary);
    }

    if (colors.accent) {
      root.style.setProperty('--brand-accent', colors.accent);
    }
  }

  /**
   * Darken a hex color by a percentage
   */
  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  /**
   * Get CSS variable value
   */
  getCSSVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();
