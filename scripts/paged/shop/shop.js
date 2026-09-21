import "./filters.js";
import { API_KEY } from "../../data/secret.js";
import { filterState } from "../../data/filterData.js";
import { buildFilteredUrl } from "../../utils/buildFilteredUrl.js";
import { renderProductsHtml } from "../../utils/renderProducts.js";

// elements
const productsGrid = document.querySelector(".products-grid");
const pageSizeSelect = document.querySelector(".page-size-select");
const previousPageButton = document.querySelector(".pagination-previous");
const nextPageButton = document.querySelector(".pagination-next");
const paginationButtons = document.querySelector(".pagination-nav-btns");
const resultsCount = document.querySelector(".results-count");

if (pageSizeSelect) {
  filterState.take = Number(pageSizeSelect.value) || filterState.take;
}

function renderPaginationNavButtons(totalPages, currentPage) {
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    html += `
      <button
        class="pagination-btn pagination-nav-btn ${isActive ? "active" : ""}"
        type="button"
        data-page="${i}"
        ${isActive ? 'aria-current="page"' : ""}
        aria-label="Page ${i}"
      >
        ${i}
      </button>`;
  }
  return html;
}

function updatePaginationControls(data) {
  if (!data) return;

  if (paginationButtons) {
    paginationButtons.innerHTML = renderPaginationNavButtons(
      data.totalPages,
      filterState.page,
    );
  }

  if (previousPageButton) {
    previousPageButton.disabled = filterState.page <= 1;
  }

  if (nextPageButton) {
    nextPageButton.disabled =
      !data.hasMore || filterState.page >= data.totalPages;
  }

  if (resultsCount && typeof data.totalCount === "number") {
    resultsCount.textContent = `${data.totalCount} products`;
  }
}

export async function renderProducts(filters = filterState) {
  const url = buildFilteredUrl(filters);

  try {
    if (productsGrid) {
      productsGrid.setAttribute("aria-busy", "true");
    }

    const response = await fetch(url, {
      headers: { "X-API-KEY": API_KEY },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data;

    if (productsGrid) {
      if (!data.items || data.items.length === 0) {
        productsGrid.innerHTML = `
          <div class="empty-state" role="status">
            <p>No products found matching your filters.</p>
          </div>
        `;
      } else {
        productsGrid.innerHTML = renderProductsHtml(data.items);
      }
    }

    updatePaginationControls(data);
  } catch (error) {
    console.error("Failed to render products:", error);
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="error-state" role="alert">
          <p>Failed to load products. Please try again later.</p>
        </div>
      `;
    }
  } finally {
    if (productsGrid) {
      productsGrid.removeAttribute("aria-busy");
    }
  }
}

if (previousPageButton) {
  previousPageButton.addEventListener("click", () => {
    if (filterState.page > 1) {
      filterState.page--;
      renderProducts(filterState);
    }
  });
}

if (nextPageButton) {
  nextPageButton.addEventListener("click", () => {
    filterState.page++;
    renderProducts(filterState);
  });
}

if (pageSizeSelect) {
  pageSizeSelect.addEventListener("change", (e) => {
    filterState.take = Number(e.target.value);
    filterState.page = 1;
    renderProducts(filterState);
  });
}

if (paginationButtons) {
  paginationButtons.addEventListener("click", (e) => {
    const button = e.target.closest(".pagination-nav-btn");
    if (!button) return;

    const targetPage = Number(button.dataset.page);
    if (targetPage && targetPage !== filterState.page) {
      filterState.page = targetPage;
      renderProducts(filterState);
    }
  });
}

// Initial render
renderProducts(filterState);
