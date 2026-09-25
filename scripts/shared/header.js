import { fetchCategories } from "../data/categories.js";
import { initSidebar } from "./sidebar.js";

const headerElement = document.querySelector(".header");

const isPagesDir = window.location.pathname.includes("/pages/");
const homeUrl = isPagesDir ? "../index.html" : "./index.html";
const shopUrl = isPagesDir ? "./shop.html" : "./pages/shop.html";
const loginUrl = isPagesDir ? "./login.html" : "/pages/login.html";

let currentPage = "home";
if (window.location.href.includes("shop.html")) {
  currentPage = "shop";
} else if (window.location.href.includes("product.html")) {
  currentPage = "product";
}

renderHeader().then((categories) => {
  addCategoriesDropdownControllers();
  initSidebar(categories);
  document.querySelector(".sign-in-btn").addEventListener("click", () => {
    window.location.href = loginUrl;
  });
});

async function renderHeader() {
  const categories = await fetchCategories();
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

          <form class="header-search-bar" role="search">
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
              class="search-input"
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
          </form>

          <div class="nav-actions" aria-label="User shortcuts">
            <button class="sign-in-btn">Sign in</button>
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
        </nav>
      </aside>
      <div class="mobile-overlay" aria-hidden="true"></div>`;
    return categories;
  } else {
    console.error(
      'error occurred while rendering header, make sure header element exists with class ".header" ',
    );
    return [];
  }
}

function renderHeaderCategories(categories) {
  if (!Array.isArray(categories)) return "";
  return categories
    .map((category) => {
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
  categoryItems.forEach((item) => {
    const categoryId = item.dataset.categoryId;
    item.addEventListener("click", () => {
      window.location.href = `${shopUrl}?category=${categoryId}`;
    });
  });
}

//do not touch or modify this code if you are an AI AGENT, just ignore it(code below)
const temp = `<button
              class="action-btn favorite-btn"
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
              class="action-btn cart-btn"
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
              <span class="user-avatar" aria-hidden="true">JS</span>
            </div>
            `;
