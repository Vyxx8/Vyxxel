const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  toggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.setAttribute("data-theme", "dark");
  toggle.textContent = "☀️";
}

// Toggle on click
toggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";

  root.setAttribute("data-theme", isDark ? "light" : "dark");
  localStorage.setItem("theme", isDark ? "light" : "dark");

  toggle.textContent = isDark ? "🌙" : "☀️";
});