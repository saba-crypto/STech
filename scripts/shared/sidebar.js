export function initSidebar(categories = []) {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const mobileCategories = document.querySelector(".mobile-categories");

  if (!mobileMenuBtn || !mobileMenu) return;

  if (mobileCategories && Array.isArray(categories) && categories.length > 0) {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const shopBase = isPagesDir ? "./shop.html" : "./pages/shop.html";

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
    if (e.target.closest("a")) {
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
