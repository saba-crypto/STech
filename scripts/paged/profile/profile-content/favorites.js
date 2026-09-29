import { fetchFavorites } from "../../../data/favorites.js";
import { renderStars } from "../../../utils/renderRatingStars.js";

let currentPage = 1;

export async function renderFavorites() {
  const favoritesGrid = document.querySelector(".favorites-grid");
  if (!favoritesGrid) return;

  currentPage = 1;
  const data = await fetchFavorites(8, currentPage);
  if (!data) return;

  favoritesGrid.innerHTML = renderFavoriteCards(data.items);
  updateLoadMoreButton(data.hasMore);
}

function updateLoadMoreButton(hasMore) {
  const favoritesTab = document.getElementById("tab-favorites");
  if (!favoritesTab) return;

  let loadMoreSection = favoritesTab.querySelector(".load-more-section");

  if (hasMore) {
    if (!loadMoreSection) {
      loadMoreSection = document.createElement("div");
      loadMoreSection.className = "load-more-section";
      loadMoreSection.innerHTML = `
        <button type="button" class="load-more-btn">Load More</button>
      `;
      favoritesTab.appendChild(loadMoreSection);

      const loadMoreBtn = loadMoreSection.querySelector(".load-more-btn");
      loadMoreBtn.addEventListener("click", handleLoadMore);
    }
  } else if (loadMoreSection) {
    loadMoreSection.remove();
  }
}

async function handleLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Loading...";
  }

  currentPage += 1;
  const data = await fetchFavorites(8, currentPage);

  if (data && data.items) {
    const favoritesGrid = document.querySelector(".favorites-grid");
    if (favoritesGrid) {
      favoritesGrid.insertAdjacentHTML(
        "beforeend",
        renderFavoriteCards(data.items)
      );
    }
    updateLoadMoreButton(data.hasMore);
  } else if (loadMoreBtn) {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = "Load More";
  }
}

function renderFavoriteCards(favorites) {
  return favorites
    .map((product) => {
      const rating = product.rating || 0;
      return `
        <article class="favorite-card">
          <span class="stock-badge ${product.stock > 0 ? "" : "out-of-stock"}">
            ${product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <button type="button" class="remove-favorite-btn" aria-label="Remove ${product.name} from favorites">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <a href="./product.html?id=${product.id}" class="product-image">
            <img src="${product.imageUrl}" alt="${product.name}" />
          </a>
          <div class="product-info">
            <span class="product-brand">${product.brand}</span>
            <a href="./product.html?id=${product.id}" class="product-name">${product.name}</a>
            <p class="product-model">${product.model}</p>
          </div>
          <div class="product-footer">
            <div class="rating-price-section">
              <div class="rating-row">
                <div class="product-rating" aria-label="${rating.toFixed(1)} out of 5 stars">
                  ${renderStars(rating)}
                </div>
                <span class="rating-value">${rating.toFixed(1)}</span>
              </div>
              <div class="price-row">
                <span class="price-current">$${product.price.toLocaleString()}</span>
              </div>
            </div>
            <button type="button" class="add-to-cart-btn" data-product-id="${product.id}">
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
