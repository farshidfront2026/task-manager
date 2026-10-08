const htmlElement = document.documentElement;
const lightModeBtn = document.getElementById("light-mode-btn");
const darkModeBtn = document.getElementById("dark-mode-btn");

const activeBtnClasses = [
  "bg-[var(--card)]",
  "text-[var(--color-primary)]",
  "shadow-xs",
];
const inactiveBtnClasses = [
  "bg-transparent",
  "text-[var(--color-secondary-muted)]",
];

function updateButtonStyles() {
  if (!lightModeBtn || !darkModeBtn) return;

  if (htmlElement.classList.contains("dark")) {
    darkModeBtn.classList.remove(...inactiveBtnClasses);
    darkModeBtn.classList.add(...activeBtnClasses);
    lightModeBtn.classList.remove(...activeBtnClasses);
    lightModeBtn.classList.add(...inactiveBtnClasses);
  } else {
    lightModeBtn.classList.remove(...inactiveBtnClasses);
    lightModeBtn.classList.add(...activeBtnClasses);
    darkModeBtn.classList.remove(...activeBtnClasses);
    darkModeBtn.classList.add(...inactiveBtnClasses);
  }
}

function setDarkMode() {
  htmlElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
  updateButtonStyles();
}

function setLightMode() {
  htmlElement.classList.remove("dark");
  localStorage.setItem("theme", "light");
  updateButtonStyles();
}

// Bind click events to theme toggle buttons
if (darkModeBtn) darkModeBtn.addEventListener("click", setDarkMode);
if (lightModeBtn) lightModeBtn.addEventListener("click", setLightMode);

updateButtonStyles();
