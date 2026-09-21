import { API_KEY } from "../../data/secret.js";
import { renderProductsHtml } from "../../utils/renderProducts.js";

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
  productsGrid.innerHTML = renderProductsHtml(data.items);
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
