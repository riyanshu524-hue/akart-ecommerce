// Theme Manager
const Theme = {
  THEME_KEY: 'akart-theme',
  currentTheme: 'light',

  init() {
    const saved = localStorage.getItem(this.THEME_KEY);
    this.currentTheme = saved || 'light';
    this.apply();
  },

  apply() {
    if (this.currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(this.THEME_KEY, this.currentTheme);
  },

  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.apply();
  },

  set(theme) {
    this.currentTheme = theme;
    this.apply();
  },
};

Theme.init();
window.Theme = Theme;
