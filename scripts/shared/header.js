import { fetchCategories } from "../data/categories.js";
import { filterState } from "../data/filterData.js";
import { fetchUser } from "../data/user.js";
import { initSidebar } from "./sidebar.js";

const headerElement = document.querySelector(".header");

const isPagesDir = window.location.pathname.includes("/pages/");
const homeUrl = isPagesDir ? "../index.html" : "./index.html";
const shopUrl = isPagesDir ? "./shop.html" : "./pages/shop.html";
const loginUrl = isPagesDir ? "./login.html" : "/pages/login.html";
const profileUrl = isPagesDir ? "./profile.html" : "/pages/profile.html";

let currentPage = "home";
if (window.location.href.includes("shop.html")) {
  currentPage = "shop";
} else if (window.location.href.includes("product.html")) {
  currentPage = "product";
}

const selectedTheme = localStorage.getItem("colorTheme") || "light";
document.documentElement.setAttribute("data-theme", selectedTheme) || "light";

renderStaticHeader();
renderHeader().then(categories => {
  addCategoriesDropdownControllers();
  addHeaderButtonControllers();
  initSidebar(categories);
});

async function renderHeader() {
  let firstNameLetter;
  let lastNameLetter;
  const categories = await fetchCategories();
  const user = await fetchUser();

  if (user) {
    firstNameLetter = user.data.firstName.charAt(0);
    lastNameLetter = user.data.lastName.charAt(0);
    sessionStorage.setItem(
      "userProfilePicture",
      `${user.data.details.pictureUrl}`
    );
  }

  if (headerElement) {
    headerElement.innerHTML = `
      <div class="header-container">
        <div class="header-content">
          <a
            class="brand-link"
            href="${homeUrl}"
            aria-label="STech Home"
          >
            <span class="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </span>
            <span class="brand-name">STECH</span>
          </a>

          <nav class="nav-links" aria-label="Main Navigation">
            <a class="nav-link ${currentPage === "home" ? "active" : ""}" href="${homeUrl}"
              >Home</a
            >
            <a
              class="nav-link ${currentPage === "shop" ? "active" : ""}"
              href="${shopUrl}"
              ${currentPage === "shop" ? 'aria-current="page"' : ""}
              >Shop</a
            >
            <div class="nav-dropdown">
              <button
                class="nav-link dropdown-trigger categories-dropdown-btn"
                type="button"
                aria-expanded="false"
                aria-haspopup="true"
                aria-label="Browse categories"
              >
                <span>Categories</span>
                <svg
                  class="dropdown-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div
                class="dropdown-menu"
                role="menu"
                aria-label="Categories"
              >${renderHeaderCategories(categories)}</div>
            </div>
          </nav>

          <div class="header-search-bar" role="search">
            <button
              class="search-toggle"
              type="button"
              aria-label="Toggle search"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              class="header-search-input"
              type="search"
              name="search"
              placeholder="Search products..."
              autocomplete="off"
              aria-label="Search products"
            />
            <button
              class="clear-search"
              type="button"
              aria-label="Clear search"
              style="display: none"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="nav-actions" aria-label="User shortcuts">
          ${
            !user
              ? `<button class="sign-in-btn">Sign in</button>`
              : `<button
              class="action-btn header-favorite-btn"
              type="button"
              aria-label="View wishlist"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M20.8 5.9a5.2 5.2 0 0 0-7.4 0L12 7.3l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 22l8.8-8.7a5.2 5.2 0 0 0 0-7.4Z"
                ></path>
              </svg>
            </button>
            <button
              class="action-btn header-cart-btn"
              type="button"
              aria-label="View shopping cart"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M3 4h2l2.1 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H6"
                ></path>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
              </svg>
            </button>
            <div class="user-btn">
              <img class="user-avatar" aria-hidden="true" src="${user.data.details.pictureUrl}" alt="${firstNameLetter}${lastNameLetter}"/>
            </div>`
          }
            
            <button
              class="mobile-menu-btn"
              type="button"
              aria-label="Open navigation menu"
              aria-expanded="false"
              aria-controls="mobile-menu"
            >
              <svg
                class="menu-open-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <svg
                class="menu-close-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <aside class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden="true">
        <nav class="mobile-nav">
          <a class="mobile-nav-link ${currentPage === "home" ? "active" : ""}" href="${homeUrl}"
            >Home</a
          >
          <a
            class="mobile-nav-link ${currentPage === "shop" ? "active" : ""}"
            href="${shopUrl}"
            ${currentPage === "shop" ? 'aria-current="page"' : ""}
            >Shop</a
          >
          <div class="mobile-nav-label">Categories</div>
          <div class="mobile-categories"></div>

          ${
            user
              ? `
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
              `
              : ""
          }
        </nav>
      </aside>
      <div class="mobile-overlay" aria-hidden="true"></div>`;
    return categories;
  } else {
    console.error(
      'error occurred while rendering header, make sure header element exists with class ".header" '
    );
    return [];
  }
}

function renderHeaderCategories(categories) {
  if (!Array.isArray(categories)) return "";
  return categories
    .map(category => {
      return `
      <div data-category-id=${category.id} class="dropdown-item">
        <span>${category.name}</span>
        <div class="item-count">${category.productCount}</div>
      </div>
    `;
    })
    .join("");
}

function addCategoriesDropdownControllers() {
  const navDropDown = document.querySelector(".nav-dropdown");
  const categoriesList = document.querySelector(".dropdown-menu");
  if (navDropDown && categoriesList) {
    navDropDown.addEventListener("mouseenter", () => {
      navDropDown.classList.add("open");
    });

    categoriesList.addEventListener("mouseleave", () => {
      navDropDown.classList.remove("open");
    });
  }

  const categoryItems = document.querySelectorAll(".dropdown-item");
  categoryItems.forEach(item => {
    const categoryId = item.dataset.categoryId;
    item.addEventListener("click", () => {
      window.location.href = `${shopUrl}?category=${categoryId}`;
    });
  });
}

function addHeaderButtonControllers() {
  const signInButton = document.querySelector(".sign-in-btn");
  const headerSearchInput = document.querySelector(".header-search-input");
  const userAvatar = document.querySelector(".user-avatar");
  const favoritesButton = document.querySelector(".header-favorite-btn");
  const cartButton = document.querySelector(".header-cart-btn");

  if (signInButton) {
    signInButton.addEventListener("click", () => {
      window.location.href = loginUrl;
    });
  }
  if (headerSearchInput) {
    headerSearchInput.value = filterState.search;
    headerSearchInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        const inputValue = event.target.value;
        window.location.href = `${shopUrl}?search=${inputValue}`;
      }
    });
  }
  if (userAvatar) {
    userAvatar.addEventListener("click", () => {
      fetchUser().then(response => {
        if (!response) {
          window.location.href = loginUrl;
        } else {
          window.location.href = `${profileUrl}?page=profile`;
        }
      });
    });
  }
  if (favoritesButton) {
    favoritesButton.addEventListener("click", () => {
      window.location.href = `${profileUrl}?page=profile#favorites`;
    });
  }
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      window.location.href = `${profileUrl}?page=profile#cart`;
    });
  }
}

//used for initial render when page loads to avoid header flickering.
function renderStaticHeader() {
  const userProfilePicture = sessionStorage.getItem("userProfilePicture");

  headerElement.innerHTML = `
      <div class="header-container">
        <div class="header-content">
          <a
            class="brand-link"

            aria-label="STech Home"
          >
            <span class="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </span>
            <span class="brand-name">STECH</span>
          </a>

          <nav class="nav-links" aria-label="Main Navigation">
            <a class="nav-link"
              >Home</a
            >
            <a
              class="nav-link "


              >Shop</a
            >
            <div class="nav-dropdown">
              <button
                class="nav-link dropdown-trigger categories-dropdown-btn"
                type="button"
                aria-expanded="false"
                aria-haspopup="true"
                aria-label="Browse categories"
              >
                <span>Categories</span>
                <svg
                  class="dropdown-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div
                class="dropdown-menu"
                role="menu"
                aria-label="Categories"
              ></div>
            </div>
          </nav>

          <div class="header-search-bar" role="search">
            <button
              class="search-toggle"
              type="button"
              aria-label="Toggle search"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              class="header-search-input"
              type="search"
              name="search"
              placeholder="Search products..."
              autocomplete="off"
              aria-label="Search products"
            />
            <button
              class="clear-search"
              type="button"
              aria-label="Clear search"
              style="display: none"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="nav-actions" aria-label="User shortcuts">
            <button class="sign-in-btn">Sign in</button>
          </div>
        </div>
      </div>

      
`;
}
