import { fetchCategories } from "../../data/categories.js";
import { filterState } from "../../data/filterData.js";
import { renderProducts } from "./shop.js";

const categoriesElement = document.querySelector(".categories");
async function renderFilters() {
  const categories = await fetchCategories();
  renderCategories(categories);
  handleCategoryController();
}
renderFilters();

function renderCategories(categories) {
  categoriesElement.innerHTML = categories
    .map((category) => {
      return `
    <div data-category-id=${category.id} class="filter-option filter-category">
      <input type="radio" name="category"/>
      <span class="option-label">${category.name}</span>
      <span class="option-count">${category.productCount}</span>
    </div>
    `;
    })
    .join("");
}

function handleCategoryController() {
  document.querySelectorAll(".filter-category").forEach((category) => {
    const categoryId = category.dataset.categoryId;
    category.addEventListener("click", (e) => {
      filterState.categoryId = Number(categoryId);
      renderProducts();
    });
  });
}
