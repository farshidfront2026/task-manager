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

function setDarkMode() {
  htmlElement.classList.add("dark");

  // Activate dark mode button styling
  darkModeBtn.classList.remove(...inactiveBtnClasses);
  darkModeBtn.classList.add(...activeBtnClasses);

  // Deactivate light mode button styling
  lightModeBtn.classList.remove(...activeBtnClasses);
  lightModeBtn.classList.add(...inactiveBtnClasses);
}

function setLightMode() {
  htmlElement.classList.remove("dark");

  // Activate light mode button styling
  lightModeBtn.classList.remove(...inactiveBtnClasses);
  lightModeBtn.classList.add(...activeBtnClasses);

  // Deactivate dark mode button styling
  darkModeBtn.classList.remove(...activeBtnClasses);
  darkModeBtn.classList.add(...inactiveBtnClasses);
}

// Bind click events to theme toggle buttons
if (darkModeBtn) darkModeBtn.addEventListener("click", setDarkMode);
if (lightModeBtn) lightModeBtn.addEventListener("click", setLightMode);
