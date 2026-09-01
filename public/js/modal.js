// Global Modal Controller
const Modal = {
  overlay: null,
  titleEl: null,
  messageEl: null,

  init() {
    this.overlay = document.getElementById("custom-modal");
    this.titleEl = document.getElementById("modal-title");
    this.messageEl = document.getElementById("modal-message");

    const closeBtn = document.getElementById("modal-x-btn");
    const okBtn = document.getElementById("modal-ok-btn");

    if (!this.overlay) return;

    // Close on button clicks
    closeBtn?.addEventListener("click", () => this.close());
    okBtn?.addEventListener("click", () => this.close());

    // Close on clicking the backdrop outside the card
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Close on pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) this.close();
    });
  },

  show(message, title = "System Notification") {
    if (!this.overlay) this.init();
    if (this.titleEl) this.titleEl.textContent = title;
    if (this.messageEl) this.messageEl.textContent = message;

    this.overlay.classList.add("active");
    this.overlay.setAttribute("aria-hidden", "false");
  },

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove("active");
    this.overlay.setAttribute("aria-hidden", "true");
  },

  isOpen() {
    return this.overlay?.classList.contains("active");
  }
};

// Shorthand function replacement for window.alert()
function showAlert(message, title = "System Notification") {
  Modal.show(message, title);
}

// Auto-initialize when the script loads
document.addEventListener("DOMContentLoaded", () => Modal.init());