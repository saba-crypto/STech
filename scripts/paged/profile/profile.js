import "../../shared/header.js";
import "../../shared/chatbot.js";
import { fetchUser } from "../../data/user.js";
import { renderProfileSidebar } from "./profile-sidebar/profile-sidebar.js";
import { renderMyProfile } from "./profile-content/myProfile.js";
import { renderCart } from "./profile-content/cart.js";
import { renderFavorites } from "./profile-content/favorites.js";
import { renderSettings } from "./profile-content/settings.js";

const initialTab =
  window.location.hash.replace("#", "") ||
  sessionStorage.getItem("currentProfilePage") ||
  "profile";
sessionStorage.setItem("currentProfilePage", initialTab);

let currentActiveTab = null;

export function switchTab(tabName) {
  const validTabs = ["profile", "cart", "favorites", "settings"];
  const targetTab = validTabs.includes(tabName) ? tabName : "profile";

  // Prevent duplicate execution if this tab is already active
  if (currentActiveTab === targetTab) {
    return;
  }
  currentActiveTab = targetTab;

  sessionStorage.setItem("currentProfilePage", targetTab);
  if (window.location.hash.replace("#", "") !== targetTab) {
    window.location.hash = targetTab;
  }

  // Toggle tab panels
  const panels = document.querySelectorAll(".profile-content .tab-panel");
  panels.forEach((panel) => {
    if (panel.id === `tab-${targetTab}`) {
      panel.hidden = false;
      panel.classList.add("active");
    } else {
      panel.hidden = true;
      panel.classList.remove("active");
    }
  });

  // Toggle sidebar active nav link
  const navItems = document.querySelectorAll(
    ".profile-nav .nav-item[data-page]",
  );
  navItems.forEach((item) => {
    const isCurrent = item.dataset.page === targetTab;
    item.classList.toggle("active", isCurrent);
    item.setAttribute("aria-selected", isCurrent ? "true" : "false");
    if (isCurrent) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  // Call page-specific render callbacks if needed
  if (targetTab === "cart") {
    renderCart();
  } else if (targetTab === "favorites") {
    renderFavorites();
  } else if (targetTab === "settings") {
    renderSettings();
  }
}

// listens for browser back/forward and hash navigation
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    switchTab(hash);
  }
});

export async function renderProfilePage() {
  const response = await fetchUser();
  if (!response) {
    window.location.href = "./login.html";
    return;
  }
  const userInfo = response.data;
  renderMyProfile(userInfo);
  renderProfileSidebar(userInfo);

  const currentTab =
    window.location.hash.replace("#", "") ||
    sessionStorage.getItem("currentProfilePage") ||
    "profile";
  switchTab(currentTab);
}

renderProfilePage();
