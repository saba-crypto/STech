import { fetchFavorites } from "../../../data/favorites.js";
import { fetchUser } from "../../../data/user.js";
import { renderStars } from "../../../utils/renderRatingStars.js";
import { API_KEY } from "../../../data/secret.js";
import { showPopup } from "../../../utils/showPopup.js";

let currentPage = 1;

export async function renderFavorites() {
  const favoritesTab = document.getElementById("tab-favorites");
  const clearAllButton = document.querySelector(".clear-all-btn");
  const favoritesGrid = document.querySelector(".favorites-grid");
  const pageSubtitle = document.querySelector(".favorites-subtitle");

  if (!favoritesGrid || !favoritesTab) return;

  currentPage = 1;
  const data = await fetchFavorites(8, currentPage);
  if (!data) return;

  if (pageSubtitle) {
    pageSubtitle.textContent = `${data.totalCount || 0} items saved`;
  }

  if (
    !data.totalCount ||
    data.totalCount === 0 ||
    !data.items ||
    data.items.length === 0
  ) {
    favoritesGrid.innerHTML = "";
    favoritesGrid.style.display = "none";
    if (clearAllButton) clearAllButton.style.display = "none";
    updateLoadMoreButton(false);
    renderEmptyFavorites(favoritesTab);
    return;
  }

  // If favorites exist, display grid and cards
  removeEmptyFavorites(favoritesTab);
  favoritesGrid.style.display = "grid";
  if (clearAllButton) clearAllButton.style.display = "flex";

  favoritesGrid.innerHTML = renderFavoriteCards(data.items);
  updateLoadMoreButton(data.hasMore);
  attachFavoriteCardListeners();

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
}

function renderEmptyFavorites(favoritesTab) {
  let emptyState = favoritesTab.querySelector(".empty-state");
  if (!emptyState) {
    emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <div class="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
      <h2>No favorites yet</h2>
      <p>Start adding products to your favorites to see them here. Click the heart icon on any product!</p>
      <a href="./shop.html" class="browse-products-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <span>Browse Products</span>
      </a>
    `;
    favoritesTab.appendChild(emptyState);
  }
}

function removeEmptyFavorites(favoritesTab) {
  const emptyState = favoritesTab.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
}

function attachFavoriteCardListeners() {
  const removeFavoriteButtons = document.querySelectorAll(
    ".remove-favorite-btn",
  );
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
        renderFavoriteCards(data.items),
      );
      attachFavoriteCardListeners();
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

async function removeFromFavorites(productId) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const userResponse = await fetchUser();
    if (!accessToken || !userResponse) {
      window.location.href = loginUrl;
    }
    if (!productId) {
      throw new Error(
        "productId is undefined, failed to remove favorite product",
      );
    }
    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/favorites/${productId}`,
      {
        method: "DELETE",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.detail);
    }
  } catch (err) {
    console.error(err.message || err);
  }
}
