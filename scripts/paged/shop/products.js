import { API_KEY } from "../../data/secret.js";
import { renderStars } from "../../utils/renderRatingStars.js";

//elements
const productsGrid = document.querySelector(".products-grid");
const productsPerPageDropdown = document.querySelector(".page-size-select");
const previousPageButton = document.querySelector(".pagination-previous");
const nextPageButton = document.querySelector(".pagination-next");
const paginationButtons = document.querySelector(".pagination-nav-btns");

//data
let currentPage = 1;
let productsPerPage = productsPerPageDropdown.value;

renderMainContent();

if (nextPageButton) {
  nextPageButton.addEventListener("click", () => {
    currentPage++;
    renderMainContent();
  });
} else {
  console.error("previous page button was not found in shop.html");
}

if (previousPageButton) {
  previousPageButton.addEventListener("click", () => {
    currentPage--;
    renderMainContent();
  });
} else {
  console.error("previous page button was not found in shop.html");
}
if (productsPerPageDropdown) {
  productsPerPageDropdown.addEventListener("change", () => {
    productsPerPage = productsPerPageDropdown.value;
    renderMainContent();
  });
} else {
  console.error(
    "products per page dropdown element(select) was not found in shop.html",
  );
}

async function renderMainContent() {
  const data = await fetchData();
  productsGrid.innerHTML = renderProducts(data.items);
  paginationButtons.innerHTML = renderPaginationNavButtons(data.totalPages);

  if (!data.hasMore) {
    nextPageButton.disabled = true;
  } else {
    nextPageButton.disabled = false;
  }
  if (currentPage === 1) {
    previousPageButton.disabled = true;
  } else {
    previousPageButton.disabled = false;
  }

  document.querySelectorAll(".pagination-nav-btn").forEach((button, i) => {
    button.addEventListener("click", () => {
      currentPage = i + 1;
      renderMainContent();
    });
  });
}

async function fetchData() {
  let response = await fetch(
    `https://shopapi.stepacademy.ge/api/products?Take=${productsPerPage}&Page=${currentPage}`,
    {
      headers: {
        "X-API-KEY": API_KEY,
      },
    },
  );
  const data = await response.json();
  return data.data;
}

function renderProducts(products) {
  return products
    .map((product) => {
      return `
    <div class="product-card">
      <div class="card-image">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <div class="quick-actions">
          <button class="action-btn favorite-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg></button
          ><button class="action-btn view-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              ></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="category">${product.category.name}</span
          ><span class="brand">${product.brand}</span>
        </div>
        <div class="card-title">
          <span>${product.name}</span>
        </div>
        <div class="card-rating">
          <div class="stars">
          
          ${renderStars(product.rating)}
              
          </div>
          <span class="rating-value">${product.rating.toFixed(1)}</span>
        </div>
        <div class="card-price"><span>USD ${product.price.toLocaleString()}</span></div>
      </div>
      <div class="card-footer">
        <button class="add-to-cart">
          <svg
            
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              
              cx="9"
              cy="21"
              r="1"
            ></circle>
            <circle
              
              cx="20"
              cy="21"
              r="1"
            ></circle>
            <path
              
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            ></path>
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
    `;
    })
    .join("");
}

function renderPaginationNavButtons(totalPages) {
  let html = ``;
  for (let i = 1; i <= totalPages; i++) {
    html += ` 
    <button
      class="pagination-btn pagination-nav-btn"
      type="button"
      aria-label="Next page"
    >
      ${i}
    </button>`;
  }

  return html;
}
