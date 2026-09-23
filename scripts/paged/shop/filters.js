import { fetchCategories } from "../../data/categories.js";
import { filterState, initialFilterState } from "../../data/filterData.js";
import { debounce } from "../../utils/debounce.js";
import { renderProducts } from "./shop.js";

const debouncedRenderProducts = debounce(() => {
  renderProducts();
  renderActiveFilterChips();
  updateFilterBadge();
}, 300);

//filter elements
const categoriesElement = document.querySelector(".categories");
const minRatingOptions = document.querySelectorAll(".rating-option");
const minPriceInput = document.querySelector(".min-price-input");
const maxPriceInput = document.querySelector(".max-price-input");
const brandInput = document.querySelector(".brand-input");
const inStockContainer = document.querySelector(".in-stock-container");
const inStockInput = document.querySelector(".in-stock-input");
const searchInput = document.querySelector(".shop-search-input");
const clearSearchBtn = document.querySelector(".clear-search");
const clearFilterButton = document.querySelector(".clear-filters-btn");
const sortBySelect = document.querySelector(".sort-select");

const filterSidebar = document.querySelector(".filter-sidebar");
const filtersOverlay = document.querySelector(".filters-overlay");
const filterToggleBtn = document.querySelector(".filter-toggle");
const closeFiltersBtn = document.querySelector(".close-filters");
const filterBadge = document.querySelector(".filter-badge");
const activeFiltersContainer = document.querySelector(".active-filters");

let categoriesMap = {};

async function renderCategories() {
  const categories = await fetchCategories();
  categoriesMap = {};
  if (Array.isArray(categories)) {
    categories.forEach((cat) => {
      categoriesMap[cat.id] = cat.name;
    });
  }
  renderCategoriesHtml(categories);
  handleCategoryController();
}

renderCategories();
handleFilterSidebar();
handleMinRatingController();
handleMinPriceController();
handleMaxPriceController();
handleBrandController();
handleInStockController();
handleSearchController();
handleSortByController();

function handleFilterSidebar() {
  filterToggleBtn.addEventListener("click", () => {
    filterSidebar.classList.add("open");
    filtersOverlay.style.display = "block";
  });

  closeFiltersBtn.addEventListener("click", () => {
    filterSidebar.classList.remove("open");
    filtersOverlay.style.display = "none";
  });

  filtersOverlay.addEventListener("click", () => {
    filterSidebar.classList.remove("open");
    filtersOverlay.style.display = "none";
  });
}

function renderCategoriesHtml(categories) {
  if (!categoriesElement || !Array.isArray(categories)) return;
  categoriesElement.innerHTML = categories
    .map((category) => {
      const isChecked =
        Number(filterState.categoryId) === category.id ? "checked" : "";
      return `
    <div data-category-id="${category.id}" class="filter-option filter-category">
      <input class="category-input" type="radio" name="category" ${isChecked} />
      <span class="option-label">${category.name}</span>
      <span class="option-count">${category.productCount}</span>
    </div>
    `;
    })
    .join("");
}

function handleCategoryController() {
  document.querySelectorAll(".filter-category").forEach((category) => {
    const categoryId = Number(category.dataset.categoryId);
    const radio = category.querySelector(".category-input");

    category.addEventListener("click", (e) => {
      e.preventDefault();
      if (filterState.categoryId === categoryId) {
        filterState.categoryId = "";
        if (radio) radio.checked = false;
      } else {
        filterState.categoryId = categoryId;
        document.querySelectorAll(".category-input").forEach((r) => {
          r.checked = false;
        });
        if (radio) radio.checked = true;
      }
      filterState.page = 1;
      renderProducts();
      renderActiveFilterChips();
      updateFilterBadge();
    });
  });
}

function handleMinRatingController() {
  if (minRatingOptions) {
    minRatingOptions.forEach((option) => {
      if (option) {
        const minRating = Number(option.dataset.minRating);

        option.addEventListener("click", () => {
          const isSelected = option.classList.contains("selected");

          minRatingOptions.forEach((opt) => {
            opt.classList.remove("selected", "active");
            opt.setAttribute("aria-pressed", "false");
          });

          if (isSelected) {
            filterState.minRating = null;
          } else {
            option.classList.add("selected", "active");
            option.setAttribute("aria-pressed", "true");
            filterState.minRating = minRating;
          }

          filterState.page = 1;
          renderProducts();
          renderActiveFilterChips();
          updateFilterBadge();
        });
      }
    });
  }
}

function handleMinPriceController() {
  if (minPriceInput) {
    minPriceInput.addEventListener("input", (e) => {
      const val = e.target.value;
      filterState.minPrice = val !== "" ? Number(val) : null;
      filterState.page = 1;
      debouncedRenderProducts();
    });
  }
}

function handleMaxPriceController() {
  if (maxPriceInput) {
    maxPriceInput.addEventListener("input", (e) => {
      const val = e.target.value;
      filterState.maxPrice = val !== "" ? Number(val) : null;
      filterState.page = 1;
      debouncedRenderProducts();
    });
  }
}

function handleBrandController() {
  if (brandInput) {
    brandInput.addEventListener("input", (e) => {
      filterState.brand = e.target.value.trim();
      filterState.page = 1;
      debouncedRenderProducts();
    });
  }
}

function handleInStockController() {
  if (inStockContainer) {
    inStockContainer.addEventListener("click", (e) => {
      e.preventDefault();
      inStockInput.checked = !inStockInput.checked;
      filterState.inStock = inStockInput.checked ? true : null;
      filterState.page = 1;
      renderProducts();
      renderActiveFilterChips();
      updateFilterBadge();
    });
  }
}

function toggleClearSearchButton() {
  if (!clearSearchBtn || !searchInput) return;
  clearSearchBtn.style.display = searchInput.value ? "flex" : "none";
}

function handleSearchController() {
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    filterState.search = e.target.value.trim();
    filterState.page = 1;
    toggleClearSearchButton();
    debouncedRenderProducts();
  });

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      filterState.search = "";
      filterState.page = 1;
      toggleClearSearchButton();
      renderProducts();
      renderActiveFilterChips();
      updateFilterBadge();
    });
  }
}

function handleSortByController() {
  if (!sortBySelect) return;
  sortBySelect.addEventListener("change", () => {
    const sortData = sortBySelect.value.split(" ");
    const sortName = sortData[0] || "";
    const isDescending = sortData[1] === "descending";
    filterState.sortBy = sortName;
    filterState.sortDescending = isDescending;
    filterState.page = 1;

    renderProducts();
  });
}

function updateFilterBadge() {
  if (!filterBadge) return;
  let count = 0;
  if (filterState.categoryId) count++;
  if (filterState.minRating) count++;
  if (filterState.minPrice) count++;
  if (filterState.maxPrice) count++;
  if (filterState.brand) count++;
  if (filterState.inStock) count++;
  if (filterState.search) count++;

  if (count > 0) {
    filterBadge.textContent = count;
    filterBadge.style.display = "inline-block";
  } else {
    filterBadge.style.display = "none";
  }
}

function renderActiveFilterChips() {
  if (!activeFiltersContainer) return;

  const chips = [];

  if (filterState.search) {
    chips.push({
      label: `Search: "${filterState.search}"`,
      clear: () => {
        filterState.search = "";
        if (searchInput) searchInput.value = "";
        toggleClearSearchButton();
      },
    });
  }

  if (filterState.categoryId && categoriesMap[filterState.categoryId]) {
    chips.push({
      label: `Category: ${categoriesMap[filterState.categoryId]}`,
      clear: () => {
        filterState.categoryId = "";
        document.querySelectorAll(".category-input").forEach((input) => {
          input.checked = false;
        });
      },
    });
  }

  if (filterState.minRating) {
    chips.push({
      label: `Rating: ${filterState.minRating}★ & up`,
      clear: () => {
        filterState.minRating = null;
        minRatingOptions.forEach((opt) => {
          opt.classList.remove("selected", "active");
          opt.setAttribute("aria-pressed", "false");
        });
      },
    });
  }

  if (filterState.minPrice !== null || filterState.maxPrice !== null) {
    const minText =
      filterState.minPrice !== null ? `$${filterState.minPrice}` : "$0";
    const maxText =
      filterState.maxPrice !== null ? `$${filterState.maxPrice}` : "...";
    chips.push({
      label: `Price: ${minText} - ${maxText}`,
      clear: () => {
        filterState.minPrice = null;
        filterState.maxPrice = null;
        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
      },
    });
  }

  if (filterState.brand) {
    chips.push({
      label: `Brand: ${filterState.brand}`,
      clear: () => {
        filterState.brand = "";
        if (brandInput) brandInput.value = "";
      },
    });
  }

  if (filterState.inStock) {
    chips.push({
      label: "In Stock Only",
      clear: () => {
        filterState.inStock = null;
        if (inStockInput) inStockInput.checked = false;
      },
    });
  }

  activeFiltersContainer.innerHTML = chips
    .map(
      (chip, idx) => `
      <div class="filter-chip">
        <span>${chip.label}</span>
        <button type="button" data-chip-idx="${idx}" aria-label="Remove filter: ${chip.label}">✕</button>
      </div>`,
    )
    .join("");

  activeFiltersContainer
    .querySelectorAll(".filter-chip button")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.chipIdx);
        if (chips[idx]) {
          chips[idx].clear();
          filterState.page = 1;
          renderProducts();
          renderActiveFilterChips();
          updateFilterBadge();
        }
      });
    });
}

if (clearFilterButton) {
  clearFilterButton.addEventListener("click", () => {
    Object.assign(filterState, initialFilterState);
    resetFilterElements();
    renderProducts();
    renderActiveFilterChips();
    updateFilterBadge();
  });
}

function resetFilterElements() {
  document.querySelectorAll(".category-input").forEach((input) => {
    input.checked = false;
  });
  if (minPriceInput) minPriceInput.value = "";
  if (maxPriceInput) maxPriceInput.value = "";
  if (brandInput) brandInput.value = "";
  if (inStockInput) inStockInput.checked = false;
  if (searchInput) searchInput.value = "";
  if (sortBySelect) sortBySelect.value = "";
  toggleClearSearchButton();

  minRatingOptions.forEach((option) => {
    option.classList.remove("selected", "active");
    option.setAttribute("aria-pressed", "false");
  });
}
