import { fetchUser } from "../data/user.js";

export function initSidebar(categories = []) {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const mobileCategories = document.querySelector(".mobile-categories");

  if (!mobileMenuBtn || !mobileMenu) return;

  const isPagesDir = window.location.pathname.includes("/pages/");
  const homeUrl = isPagesDir ? "../index.html" : "./index.html";
  const loginUrl = isPagesDir ? "./login.html" : "/pages/login.html";
  const profileUrl = isPagesDir ? "./profile.html" : "/pages/profile.html";
  const shopBase = isPagesDir ? "./shop.html" : "./pages/shop.html";

  if (mobileCategories && Array.isArray(categories) && categories.length > 0) {
    mobileCategories.innerHTML = categories
      .map(
        (category) => `
      <a href="${shopBase}?category=${category.id}" class="mobile-category-link" data-category-id="${category.id}">
        <span>${category.name}</span>
        <span class="item-count">${category.productCount}</span>
      </a>
    `,
      )
      .join("");
  }

  fetchUser().then((user) => {
    if (user) {
      renderSidebarUserActions(mobileMenu);
      addSidebarButtonControllers({ homeUrl, loginUrl, profileUrl });
    } else {
      removeSidebarUserActions(mobileMenu);
    }
  });

  function openSidebar() {
    mobileMenu.classList.add("open");
    if (mobileOverlay) {
      mobileOverlay.classList.add("active");
      mobileOverlay.setAttribute("aria-hidden", "false");
    }
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    mobileMenuBtn.setAttribute("aria-label", "Close navigation menu");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeSidebar() {
    mobileMenu.classList.remove("open");
    if (mobileOverlay) {
      mobileOverlay.classList.remove("active");
      mobileOverlay.setAttribute("aria-hidden", "true");
    }
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function toggleSidebar() {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  mobileMenuBtn.addEventListener("click", toggleSidebar);

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeSidebar);
  }

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.closest("a") || e.target.closest(".mobile-action-btn")) {
      closeSidebar();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeSidebar();
      mobileMenuBtn.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && mobileMenu.classList.contains("open")) {
      closeSidebar();
    }
  });
}

function renderSidebarUserActions(mobileMenu) {
  const mobileNav = mobileMenu.querySelector(".mobile-nav");
  if (!mobileNav || mobileNav.querySelector(".mobile-user-actions")) return;

  mobileNav.insertAdjacentHTML(
    "beforeend",
    `
    <div class="mobile-nav-label sidebar-account-label">Account</div>
    <div class="mobile-user-actions">
      <button type="button" class="mobile-action-btn sidebar-profile-btn" aria-label="Profile">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </button>
      <button type="button" class="mobile-action-btn sidebar-cart-btn" aria-label="Cart">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>Cart</span>
      </button>
      <button type="button" class="mobile-action-btn sidebar-favorites-btn" aria-label="Favorites">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Favorites</span>
      </button>
      <button type="button" class="mobile-action-btn sidebar-logout-btn" aria-label="Logout">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </button>
    </div>
    `,
  );
}

function removeSidebarUserActions(mobileMenu) {
  const userActions = mobileMenu.querySelector(".mobile-user-actions");
  if (userActions) {
    userActions.remove();
  }
  const accountLabel = mobileMenu.querySelector(".sidebar-account-label");
  if (accountLabel) {
    accountLabel.remove();
  }
}

function addSidebarButtonControllers({ homeUrl, loginUrl, profileUrl }) {
  const profileButton = document.querySelector(".sidebar-profile-btn");
  const cartButton = document.querySelector(".sidebar-cart-btn");
  const favoritesButton = document.querySelector(".sidebar-favorites-btn");
  const logoutButton = document.querySelector(".sidebar-logout-btn");

  if (profileButton) {
    profileButton.addEventListener("click", () => {
      fetchUser().then((response) => {
        if (!response) {
          window.location.href = loginUrl;
        } else {
          window.location.href = `${profileUrl}?page=profile#profile`;
        }
      });
    });
  }

  if (cartButton) {
    cartButton.addEventListener("click", () => {
      window.location.href = `${profileUrl}?page=profile#cart`;
    });
  }

  if (favoritesButton) {
    favoritesButton.addEventListener("click", () => {
      window.location.href = `${profileUrl}?page=profile#favorites`;
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = homeUrl;
    });
  }
}
