import { fetchCategories } from "../data/categories.js";
const navDropDown = document.querySelector(".nav-dropdown");
const categoriesBtn = document.querySelector(".categories-dropdown-btn");
const categoriesList = document.querySelector(".dropdown-menu");

if (navDropDown) {
  navDropDown.addEventListener("mouseenter", () => {
    navDropDown.classList.add("open");
  });

  categoriesList.addEventListener("mouseleave", () => {
    navDropDown.classList.remove("open");
  });
}

renderCategories();

async function renderCategories() {
  const categories = await fetchCategories();
  categoriesList.innerHTML = categories
    .map((category) => {
      return `
      <div data-category-id=${category.id} class="dropdown-item">
        <span>${category.name}</span>
        <div class="item-count">${category.productCount}</div>
      </div>
    `;
    })
    .join("");

  const categoryItems = document.querySelectorAll(".dropdown-item");
  categoryItems.forEach((item) => {
    const categoryId = item.dataset.categoryId;
    item.addEventListener("click", () => {
      window.location.href = `http://127.0.0.1:5500/pages/shop.html?category=${categoryId}`;
    });
  });
}
