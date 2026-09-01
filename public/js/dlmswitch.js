document.addEventListener("DOMContentLoaded", () => {
  // Select all toggle buttons (desktop + mobile) and icon spans
  const toggleButtons = document.querySelectorAll("#theme-toggle, #theme-toggle-mobile");
  const themeIcons = document.querySelectorAll(".theme-icon, #theme-icon");

  if (toggleButtons.length === 0) return;

  function updateIcons(theme) {
    themeIcons.forEach((icon) => {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    });
  }

  // 1. Sync icon on initial load
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  updateIcons(currentTheme);

  // 2. Attach click listener to every toggle button present
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = activeTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("sahayak_theme", nextTheme);
      updateIcons(nextTheme);
    });
  });
});