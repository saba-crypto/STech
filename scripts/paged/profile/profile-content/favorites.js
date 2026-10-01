import {
  fetchFavorites,
  removeFromFavorites,
} from "../../../data/favorites.js";
import { addToCart } from "../../../data/cart.js";
import { renderStars } from "../../../utils/renderRatingStars.js";
import { showPopup } from "../../../utils/showPopup.js";
import {
  renderEmptyState,
  removeEmptyState,
  EMPTY_FAVORITES_ICON,
} from "../../../shared/empty-state.js";
import { updateLoadMoreButton } from "../../../shared/load-more.js";

let currentPage = 1;

export function renderFavorites() {
  currentPage = 1;
  fetchFavorites(8, currentPage).then((favoritesData) => {
    if (
      favoritesData &&
      favoritesData.items &&
      favoritesData.items.length > 0
    ) {
      renderFavoriteItems(favoritesData.items);
      renderFavoritesSummary(favoritesData);
      addEventListeners();
    } else {
      displayEmptyFavoritesContainer();
    }
  });
}

function renderFavoriteItems(favoriteItems) {
  const favoritesGrid = document.querySelector(".favorites-grid");
  if (!favoritesGrid) return;

  favoritesGrid.style.display = "grid";
  favoritesGrid.innerHTML = renderFavoriteCards(favoriteItems);
}

function renderFavoritesSummary(favoritesData) {
  const favoritesTab = document.getElementById("tab-favorites");
  const subtitle = document.querySelector(".favorites-subtitle");
  const clearAllButton = document.querySelector(".clear-all-btn");

  if (subtitle) {
    subtitle.textContent = `${favoritesData.totalCount || favoritesData.items.length} items saved`;
  }

  if (clearAllButton) {
    clearAllButton.style.display = "flex";
  }

  if (favoritesTab) {
    removeEmptyState(favoritesTab);
  }

  updateFavoritesLoadMoreButton(favoritesData.hasMore);
}

function addEventListeners() {
  const removeFavoriteButtons = document.querySelectorAll(
    ".remove-favorite-btn",
  );
  const clearAllButton = document.querySelector(".clear-all-btn");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  if (removeFavoriteButtons) {
    removeFavoriteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const card = e.target.closest(".favorite-card");
        const productId = card?.dataset.productId;
        if (productId) {
          await removeFromFavorites(productId);
          renderFavorites();
        }
      });
    });
  }

  if (clearAllButton && !clearAllButton.dataset.listenerAttached) {
    clearAllButton.dataset.listenerAttached = "true";
    clearAllButton.addEventListener("click", async () => {
      const cards = document.querySelectorAll(".favorite-card");
      for (const card of cards) {
        const productId = card.dataset.productId;
        if (productId) {
          await removeFromFavorites(productId);
        } else {
          showPopup("Failed to remove favorite, please try again");
        }
      }
      renderFavorites();
    });
  }

  if (addToCartButtons) {
    addToCartButtons.forEach((button) => {
      if (!button.dataset.listenerAttached) {
        button.dataset.listenerAttached = "true";
        button.addEventListener("click", async (e) => {
          const productId =
            e.target.closest(".add-to-cart-btn")?.dataset.productId;
          if (productId) {
            await addToCart(productId, 1);
          }
        });
      }
    });
  }
}

function displayEmptyFavoritesContainer() {
  const favoritesGrid = document.querySelector(".favorites-grid");
  const clearAllButton = document.querySelector(".clear-all-btn");

  if (favoritesGrid) {
    favoritesGrid.innerHTML = "";
    favoritesGrid.style.display = "none";
  }

  if (clearAllButton) {
    clearAllButton.style.display = "none";
  }

  updateFavoritesLoadMoreButton(false);

  const favoritesTab = document.getElementById("tab-favorites");
  renderEmptyState(favoritesTab, {
    iconSvg: EMPTY_FAVORITES_ICON,
    title: "No favorites yet",
    description: "Start adding products to your favorites to see them here. Click the heart icon on any product!",
    subtitleSelector: ".favorites-subtitle",
    subtitleText: "0 items saved",
  });
}

function updateFavoritesLoadMoreButton(hasMore) {
  const favoritesTab = document.getElementById("tab-favorites");

  updateLoadMoreButton({
    container: favoritesTab,
    hasMore,
    onLoadMore: handleLoadMore,
  });
}

async function handleLoadMore() {
  currentPage += 1;
  const data = await fetchFavorites(8, currentPage);

  if (data && data.items) {
    const favoritesGrid = document.querySelector(".favorites-grid");
    if (favoritesGrid) {
      favoritesGrid.insertAdjacentHTML(
        "beforeend",
        renderFavoriteCards(data.items),
      );
      addEventListeners();
    }
    updateFavoritesLoadMoreButton(data.hasMore);
  }
}

function renderFavoriteCards(favorites) {
  return favorites
    .map((product) => {
      const rating = product.rating || 0;
      const outOfStock = product.stock === 0 ? true : false;
      const isDisabled = outOfStock ? "disabled" : "";
      return `
        <article data-product-id="${product.id}" class="favorite-card">
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
            <button ${isDisabled} type="button" class="add-to-cart-btn" data-product-id="${product.id}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>${outOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}
