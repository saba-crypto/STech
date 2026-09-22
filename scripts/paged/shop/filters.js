import { fetchCategories } from "../../data/categories.js";
import { filterState } from "../../data/filterData.js";
import { renderProducts } from "./shop.js";

//categories
const categoriesElement = document.querySelector(".categories");
const minRatingOptions = document.querySelectorAll(".rating-option");
const minPriceInput = document.querySelector(".min-price-input");
const maxPriceInput = document.querySelector(".max-price-input");

async function renderFilters() {
  const categories = await fetchCategories();
  renderCategories(categories);
  handleCategoryController();
  handleMinRatingController();
  handleMinPriceController();
  handleMaxPriceController();
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

//star ratings

function handleMinRatingController() {
  minRatingOptions.forEach((option) => {
    const minRating = option.dataset.minRating;

    option.addEventListener("click", () => {
      filterState.minRating = minRating;
      renderProducts();
    });
  });
}

function handleMinPriceController() {
  minPriceInput.addEventListener("input", (e) => {
    let inputValue = Number(e.target.value);
    if (typeof inputValue === "number") {
      filterState.minPrice = e.target.value;
      renderProducts();
    }
  });
}

function handleMaxPriceController() {
  maxPriceInput.addEventListener("input", (e) => {
    let inputValue = Number(e.target.value);
    if (typeof inputValue === "number") {
      filterState.maxPrice = e.target.value;
      renderProducts();
    }
  });
}
