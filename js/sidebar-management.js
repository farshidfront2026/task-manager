const sidebar = document.getElementById("sidebar");
const hamburgerBtn = document.getElementById("hamburger-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function openSidebar() {
  sidebar.classList.remove("translate-x-full");
  sidebar.classList.add("translate-x-0");
  sidebarOverlay.classList.remove("opacity-0", "pointer-events-none");
  sidebarOverlay.classList.add("opacity-100", "pointer-events-auto");
}

function closeSidebar() {
  sidebar.classList.remove("translate-x-0");
  sidebar.classList.add("translate-x-full");
  sidebarOverlay.classList.remove("opacity-100", "pointer-events-auto");
  sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
}

if (hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);
