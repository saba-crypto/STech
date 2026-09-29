import { fetchFavorites } from "../../../data/favorites.js";
import { renderStars } from "../../../utils/renderRatingStars.js";

export async function renderFavorites() {
  const favoritesGrid = document.querySelector(".favorites-grid");
  fetchFavorites().then((data) => {
    favoritesGrid.innerHTML = renderFavoriteCards(data.items);
  });
}

function renderFavoriteCards(favorites) {
  return favorites
    .map((product) => {
      return `
      
      <article class="favorite-card">
        <span class="stock-badge">${product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        <button type="button" class="remove-favorite-btn" aria-label="Remove HP Spectre x360 from favorites">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <a href="./product.html?id=6" class="product-image">
          <img src="${product.imageUrl}" alt="${product.name}">
        </a>
        <div class="product-info">
          <span class="product-brand">${product.brand}</span>
          <a href="./product.html?id=6" class="product-name">${product.name}</a>
          <p class="product-model">${product.model}</p>
        </div>
        <div class="product-footer">
          <div class="rating-price-section">
            <div class="rating-row">
              <div class="product-rating" aria-label="${product.rating.toFixed(1)} out of 5 stars">
                ${renderStars(product.rating)}
              </div>
              <span class="rating-value">${product.rating.toFixed(1)}</span>
            </div>
            <div class="price-row">
              <span class="price-current">${product.price.toLocaleString()}</span>
            </div>
          </div>
          <button type="button" class="add-to-cart-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </article>
      `;
    })
    .join("");
}
