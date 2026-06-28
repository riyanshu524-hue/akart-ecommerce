// UI Manager
const UI = {
  showModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">${content}</div>
        <div class="modal-footer">
          ${buttons.map(btn => `<button class="btn ${btn.className || 'btn-primary'}" onclick="${btn.onclick}">${btn.text}</button>`).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  },

  showLoading(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <p>${message}</p>
    `;
    document.body.appendChild(loader);
    return loader;
  },

  hideLoading() {
    document.querySelector('.loader-overlay')?.remove();
  },
};

window.UI = UI;
