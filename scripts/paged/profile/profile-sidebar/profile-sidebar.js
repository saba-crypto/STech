import { switchTab } from "../profile.js";

export function renderProfileSidebar(user) {
  const currentPage =
    window.location.hash.replace("#", "") ||
    sessionStorage.getItem("currentProfilePage") ||
    "profile";
  const userFirstLetterName = (user.firstName || "U").charAt(0);
  const userLastLetterName = (user.lastName || "").charAt(0);
  const profileSidebar = document.querySelector(".profile-sidebar");

  if (profileSidebar) {
    profileSidebar.innerHTML = `
      <div class="user-card">
        <div class="user-avatar-wrapper">
          <div class="user-avatar">
            <span class="avatar-initials">${userFirstLetterName}${userLastLetterName}</span>
            <span class="avatar-badge verified" aria-label="Verified user">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
        </div>
        <div class="user-info">
          <h3 class="user-name">${user.firstName || "User"} ${user.lastName || ""}</h3>
          <p class="user-email">${user.email || ""}</p>
        </div>
      </div>

      <nav class="profile-nav" aria-label="Account navigation" role="tablist">
        <a href="#profile" data-page="profile" class="nav-item profile-link ${currentPage === "profile" ? "active" : ""}" role="tab" id="nav-profile" aria-controls="tab-profile" aria-selected="${currentPage === "profile" ? "true" : "false"}" ${currentPage === "profile" ? 'aria-current="page"' : ""}>
          <div class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span>My Profile</span>
        </a>

        <a href="#cart" data-page="cart" class="nav-item cart-link ${currentPage === "cart" ? "active" : ""}" role="tab" id="nav-cart" aria-controls="tab-cart" aria-selected="${currentPage === "cart" ? "true" : "false"}" ${currentPage === "cart" ? 'aria-current="page"' : ""}>
          <div class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span>Cart</span>
        </a>

        <a href="#favorites" data-page="favorites" class="nav-item favorites-link ${currentPage === "favorites" ? "active" : ""}" role="tab" id="nav-favorites" aria-controls="tab-favorites" aria-selected="${currentPage === "favorites" ? "true" : "false"}" ${currentPage === "favorites" ? 'aria-current="page"' : ""}>
          <div class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span>Favorites</span>
        </a>

        <a href="#settings" data-page="settings" class="nav-item settings-link ${currentPage === "settings" ? "active" : ""}" role="tab" id="nav-settings" aria-controls="tab-settings" aria-selected="${currentPage === "settings" ? "true" : "false"}" ${currentPage === "settings" ? 'aria-current="page"' : ""}>
          <div class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <span>Settings</span>
        </a>

        <div class="nav-divider" role="separator"></div>

        <button type="button" class="nav-item logout">
          <div class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <span>Logout</span>
        </button>
      </nav>`;
    addSidebarNavigationControllers();
  }
}

function addSidebarNavigationControllers() {
  const navItems = document.querySelectorAll(
    ".profile-nav .nav-item[data-page]"
  );
  navItems.forEach((item) => {
    const page = item.dataset.page;
    item.addEventListener("click", (e) => {
      e.preventDefault();
      switchTab(page);
    });
  });
}
