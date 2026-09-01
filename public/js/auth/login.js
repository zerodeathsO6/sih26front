/**
 * Sahayak Auth Logic Layer (login.js)
 * Manages API flows and calls window.AuthUI.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Input References
  const emailInput = document.getElementById("user-email");
  const otpInput = document.getElementById("user-otp");
  const passwordInput = document.getElementById("user-password");

  // Button References
  const submitEmailBtn = document.getElementById("btn-submit-email");
  const submitOtpBtn = document.getElementById("btn-submit-otp");
  const submitLoginBtn = document.getElementById("btn-submit-login");
  const backToEmailBtn = document.getElementById("btn-back-to-email");
  // const backToOtpBtn = document.getElementById("btn-back-to-otp");

  // --- Keyboard Handling (Shift + Enter) ---
  const keyboardBindings = [
    { input: emailInput, button: submitEmailBtn },
    { input: otpInput, button: submitOtpBtn },
    { input: passwordInput, button: submitLoginBtn },
  ];

  keyboardBindings.forEach(({ input, button }) => {
    input?.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" && e.shiftKey) || e.key == "Enter") {
        e.preventDefault();
        button?.click();
      }
    });
  });

  // --- Step 1: Email Submission ---
  submitEmailBtn?.addEventListener("click", async () => {
    const email = emailInput?.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      window.AuthUI.showAlert(
        "Please enter your registered email address.",
        "Required Field",
      );
      return;
    }
    if (!emailRegex.test(email)) {
      window.AuthUI.showAlert(
        "Please provide a valid email format (e.g., officer@nhaa.gov.in).",
        "Invalid Email",
      );
      return;
    }

    window.AuthUI.setButtonLoading(submitEmailBtn, "Sending OTP...");

    try {
      /* 
      // REAL BACKEND CALL:
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      */

      // Mock Latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      window.AuthUI.setStage(2);
      otpInput?.focus();
    } catch (err) {
      window.AuthUI.showAlert(
        err.message || "Failed to dispatch OTP.",
        "Error",
      );
    } finally {
      window.AuthUI.resetButtonLoading(submitEmailBtn);
    }
  });

  // --- Step 2: OTP Submission ---
  submitOtpBtn?.addEventListener("click", async () => {
    const otp = otpInput?.value.trim();

    if (!otp) {
      window.AuthUI.showAlert(
        "Please enter the 6-digit passcode sent to your email.",
        "Missing OTP",
      );
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      window.AuthUI.showAlert(
        "The OTP must consist of exactly 6 numeric digits.",
        "Invalid Code",
      );
      return;
    }

    window.AuthUI.setButtonLoading(submitOtpBtn, "Verifying Code...");

    try {
      /*
      // REAL BACKEND CALL:
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value.trim(), otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid passcode');
      */

      // Mock Latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      window.AuthUI.setStage(3);
      passwordInput?.focus();
    } catch (err) {
      window.AuthUI.showAlert(
        err.message || "Failed to verify OTP.",
        "Verification Error",
      );
    } finally {
      window.AuthUI.resetButtonLoading(submitOtpBtn);
    }
  });

  // --- Step 3: Final Password Submission ---
  submitLoginBtn?.addEventListener("click", async () => {
    const password = passwordInput?.value;

    if (!password) {
      window.AuthUI.showAlert(
        "Please enter your account password.",
        "Missing Password",
      );
      return;
    }
    if (password.length < 6) {
      window.AuthUI.showAlert(
        "Password must contain at least 6 characters.",
        "Authentication Error",
      );
      return;
    }

    window.AuthUI.setButtonLoading(submitLoginBtn, "Authenticating...");

    try {
      /*
      // REAL BACKEND CALL:
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailInput.value.trim(),
          password 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      */

      // Mock Latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Trigger full visual completion
      window.AuthUI.setStage(4);
      window.AuthUI.showAlert(
        "Identity verified. Redirecting to NHAA Portal...",
        "Access Granted",
      );
      window.location.href = "/dashboard";

      // Redirect after success
      // setTimeout(() => { window.location.href = '/dashboard.html'; }, 1200);
    } catch (err) {
      window.AuthUI.showAlert(
        err.message || "Invalid password credentials.",
        "Access Denied",
      );
    } finally {
      window.AuthUI.resetButtonLoading(submitLoginBtn);
    }
  });

  // Evaluate the password, regex to match if it has numbers from 0 to 9 and a to z
  passwordInput?.addEventListener("input", (e) => {
    const pass = e.target.value;
    if (!pass) {
      window.AuthUI.updateStrengthMeter(0);
      return;
    }

    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    window.AuthUI.updateStrengthMeter(score);
  });

  // --- Step Backtrack Navigation ---
  backToEmailBtn?.addEventListener("click", () => window.AuthUI.setStage(1));
  // backToOtpBtn?.addEventListener("click", () => window.AuthUI.setStage(2));
  // Going back to Otp almost certainly wont work since it will have to check for the OTP again.
});
