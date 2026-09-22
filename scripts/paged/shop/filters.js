import { fetchCategories } from "../../data/categories.js";
import { filterState, initialFilterState } from "../../data/filterData.js";
import { debounce } from "../../utils/debounce.js";
import { renderProducts } from "./shop.js";

const debouncedRenderProducts = debounce(renderProducts, 300);

const categoriesElement = document.querySelector(".categories");

const minRatingOptions = document.querySelectorAll(".rating-option");
const minPriceInput = document.querySelector(".min-price-input");
const maxPriceInput = document.querySelector(".max-price-input");
const brandInput = document.querySelector(".brand-input");
const inStockContainer = document.querySelector(".in-stock-container");
const inStockInput = document.querySelector(".in-stock-input");
const searchInput = document.querySelector(".shop-search-input");
const clearFilterButton = document.querySelector(".clear-filters-btn");
const sortBySelect = document.querySelector(".sort-select");

async function renderCategories() {
  const categories = await fetchCategories();
  renderCategoriesHtml(categories);
  handleCategoryController();
}
renderCategories();
handleMinRatingController();
handleMinPriceController();
handleMaxPriceController();
handleBrandController();
handleInStockController();
handleSearchController();
handleSortByController();
function renderCategoriesHtml(categories) {
  categoriesElement.innerHTML = categories
    .map((category) => {
      const isChecked =
        filterState.categoryId === categories.id ? "checked" : "";
      return `
    <div data-category-id=${category.id} class="filter-option filter-category">
      <input class="category-input" type="radio" name="category" ${isChecked} />
      <span class="option-label">${category.name}</span>
      <span class="option-count">${category.productCount}</span>
    </div>
    `;
    })
    .join("");
}

function handleCategoryController() {
  document.querySelectorAll(".filter-category").forEach((category, i) => {
    const categoryId = category.dataset.categoryId;
    const categoryInputs = document.querySelectorAll(".category-input");
    category.addEventListener("click", (e) => {
      filterState.categoryId = Number(categoryId);
      categoryInputs[i].checked = true;
      renderProducts();
    });
  });
}

function handleMinRatingController() {
  if (minRatingOptions) {
    minRatingOptions.forEach((option) => {
      if (option) {
        const minRating = option.dataset.minRating;

        option.addEventListener("click", () => {
          filterState.minRating = minRating;
          filterState.page = 1;
          renderProducts();
        });
      }
    });
  }
}

function handleMinPriceController() {
  if (minPriceInput) {
    minPriceInput.addEventListener("input", (e) => {
      let inputValue = Number(e.target.value);
      if (typeof inputValue === "number") {
        filterState.minPrice = e.target.value;
        filterState.page = 1;
        debouncedRenderProducts();
      }
    });
  }
}

function handleMaxPriceController() {
  if (maxPriceInput) {
    maxPriceInput.addEventListener("input", (e) => {
      let inputValue = Number(e.target.value);
      if (typeof inputValue === "number") {
        filterState.maxPrice = e.target.value;
        filterState.page = 1;
        debouncedRenderProducts();
      }
    });
  }
}

function handleBrandController() {
  if (brandInput) {
    brandInput.addEventListener("input", (e) => {
      let inputValue = e.target.value;
      filterState.brand = inputValue;
      filterState.page = 1;
      debouncedRenderProducts();
    });
  }
}

function handleInStockController() {
  if (inStockContainer) {
    inStockContainer.addEventListener("click", () => {
      if (inStockInput.checked) {
        filterState.inStock = true;
      } else {
        filterState.inStock = null;
      }
      filterState.page = 1;
    });
  }
}

function handleSearchController() {
  searchInput.addEventListener("input", (e) => {
    const inputValue = e.target.value;
    if (inputValue) {
      filterState.search = inputValue;
      filterState.page = 1;
      debouncedRenderProducts();
    }
  });
}

function handleSortByController() {
  sortBySelect.addEventListener("change", () => {
    const sortData = sortBySelect.value.split(" ");
    const sortName = sortData[0];
    const isDescending = sortData[1] === "descending" ? true : false;
    filterState.sortBy = sortName;
    filterState.sortDescending = isDescending;
    filterState.page = 1;

    renderProducts();
  });
}

if (clearFilterButton) {
  clearFilterButton.addEventListener("click", () => {
    Object.assign(filterState, initialFilterState);
    renderProducts();
    resetFilterElements();
  });
}

function resetFilterElements() {
  renderCategories();
  minPriceInput.value = "";
  maxPriceInput.value = "";
  brandInput.value = "";
  inStockInput.checked = false;
  searchInput.value = "";
  sortBySelect.value = "";
  minRatingOptions.forEach((option) => {
    if (option.classList.contains("selected")) {
      option.classList.remove("selected");
    }
  });
}
