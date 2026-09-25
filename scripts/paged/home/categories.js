import { fetchCategories } from "../../data/categories.js";
const categoriesGrid = document.querySelector(".categories-grid");

async function renderCategoryCards() {
  const categories = await fetchCategories(4);
  if (categoriesGrid) {
    categoriesGrid.innerHTML = categories
      .map((category) => {
        return `
    <div data-category-id=${category.id} class="category-card">
      <div class="category-icon">
        <img
          class="category-image"
          src="${category.imageUrl}"
          alt="${category.name}"
        />
      </div>
      <div class="category-info">
        <h3 class="category-name">${category.name}</h3>
        <span class="product-count">${category.productCount} products</span>
      </div>
      <div class="category-arrow">
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
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
    `;
      })
      .join("");
  }
}

renderCategoryCards().then(() => {
  document.querySelectorAll(".category-card").forEach((card) => {
    const categoryId = card.dataset.categoryId;
    card.addEventListener("click", () => {
      window.location.href = `./pages/shop.html?category=${categoryId}`;
    });
  });
});
