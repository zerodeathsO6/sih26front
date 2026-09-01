/**
 * Sahayak Auth UI Layer (loginDesign.js)
 * Exposes window.AuthUI for external business logic.
 */
(function () {
  const stages = {
    1: document.getElementById("stage-email"),
    2: document.getElementById("stage-otp"),
    3: document.getElementById("stage-password"),
  };

  const stepNodes = {
    1: document.getElementById("sidebar-step-1"),
    2: document.getElementById("sidebar-step-2"),
    3: document.getElementById("sidebar-step-3"),
  };

  const lineFill = document.getElementById("progress-line-fill");
  const alertModal = document.getElementById("alertModal");
  const alertTitle = document.getElementById("alertModalTitle");
  const alertMsg = document.getElementById("alertModalMessage");

  // Modal Dismiss Helpers
  const dismissModal = () => {
    if (alertModal) {
      alertModal.classList.remove("active");
      alertModal.setAttribute("aria-hidden", "true");
    }
  };

  document
    .getElementById("closeAlertBtn")
    ?.addEventListener("click", dismissModal);
  document
    .getElementById("confirmAlertBtn")
    ?.addEventListener("click", dismissModal);
  alertModal?.addEventListener("click", (e) => {
    if (e.target === alertModal) dismissModal();
  });

  // UI Controller Object
  window.AuthUI = {
    // 1. Alert Modal
    showAlert(message, title = "Authentication Alert") {
      if (!alertModal) {
        window.alert(`${title}: ${message}`);
        return;
      }
      if (alertTitle) alertTitle.textContent = title;
      if (alertMsg) alertMsg.textContent = message;
      alertModal.classList.add("active");
      alertModal.setAttribute("aria-hidden", "false");
    },

    // 2. Set Stepper & Form Stage (1: Email, 2: OTP, 3: Password, 4: Complete)
    setStage(step) {
      // Toggle form sections
      Object.keys(stages).forEach((k) => {
        if (stages[k]) {
          stages[k].style.display = parseInt(k) === step ? "block" : "none";
        }
      });

      // Update vertical progress line height
      if (lineFill) {
        if (step === 1) lineFill.style.height = "0%";
        else if (step === 2) lineFill.style.height = "50%";
        else if (step >= 3) lineFill.style.height = "100%";
      }

      // Update Step Nodes
      Object.keys(stepNodes).forEach((k) => {
        const node = stepNodes[k];
        if (!node) return;
        const dot = node.querySelector(".step-dot");
        const num = parseInt(k);

        if (num < step || step === 4) {
          // Completed
          node.style.opacity = "1";
          if (dot) {
            dot.style.background = "var(--primary)";
            dot.style.borderColor = "var(--primary)";
            dot.style.color = "#fff";
            dot.textContent = "✓";
          }
        } else if (num === step) {
          // Active
          node.style.opacity = "1";
          if (dot) {
            dot.style.background = "var(--bg-surface)";
            dot.style.borderColor = "var(--primary)";
            dot.style.color = "var(--primary)";
            dot.textContent = num;
          }
        } else {
          // Pending
          node.style.opacity = "0.45";
          if (dot) {
            dot.style.background = "var(--bg-surface)";
            dot.style.borderColor = "var(--border)";
            dot.style.color = "var(--text-muted)";
            dot.textContent = num;
          }
        }
      });
    },

    // 3. Button Loading Controls
    setButtonLoading(buttonOrId, loadingText = "Processing...") {
      const btn =
        typeof buttonOrId === "string"
          ? document.getElementById(buttonOrId)
          : buttonOrId;
      if (!btn || btn.dataset.loading === "true") return;
      btn.dataset.loading = "true";
      btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.8";
      btn.innerHTML = `<span class="btn-spinner"></span> ${loadingText}`;
    },

    resetButtonLoading(buttonOrId) {
      const btn =
        typeof buttonOrId === "string"
          ? document.getElementById(buttonOrId)
          : buttonOrId;
      if (!btn || !btn.dataset.originalHtml) return;
      btn.innerHTML = btn.dataset.originalHtml;
      btn.disabled = false;
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
      delete btn.dataset.loading;
    },
    // Add this inside the window.AuthUI = { ... } definition
    updateStrengthMeter(score) {
      const bars = document.querySelectorAll(".strength-bar");
      const label = document.getElementById("strength-label");
      if (!bars.length || !label) return;

      const states = [
        { text: "", color: "var(--border)" },
        { text: "Weak", color: "var(--danger)" },
        { text: "Fair", color: "var(--warning)" },
        { text: "Good", color: "#3b82f6" },
        { text: "Strong", color: "var(--primary)" },
      ];

      const current = states[score] || states[0];
      label.textContent = current.text;
      label.style.color = current.color;

      bars.forEach((bar, index) => {
        bar.style.backgroundColor =
          index < score ? current.color : "var(--border)";
      });
    },
  };
})();
