import { renderStars } from "../utils/renderRatingStars.js";
import { addToFavorites, removeFromFavorites } from "../data/favorites.js";
import { addToCart } from "../data/cart.js";
import { showPopup } from "../utils/showPopup.js";
//used for rendering product cards based on provided products array, use it whenever you need to render a product card(s)
export function renderProductsHtml(products) {
  return products
    .map(product => {
      const isFavorite = Boolean(product.isFavorite);
      return `
    <div data-product-id=${product.id} class="product-card">
      <div class="card-image">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <div class="card-badges">
          ${product.isNew ? "<span class='new-badge'>NEW</span>" : ""}
          ${product.stock === 0 ? "<span class='out-of-stock-badge'>Out of Stock</span>" : ""}
        </div>
        
        <div class="quick-actions">
          <button class="action-btn favorite-btn ${isFavorite ? "active" : ""}" type="button" aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="${isFavorite ? "currentColor" : "none"}"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg></button
          ><button class="action-btn view-btn" type="button" aria-label="View product">
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
        <button ${product.stock === 0 ? "disabled" : ""} class="add-to-cart">
          ${
            product.stock === 0
              ? `
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          `
              : `
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
          `
          }
          <span>${product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
    `;
    })
    .join("");
}
document.addEventListener("click", async e => {
  const addToCartButton = e.target.closest(".add-to-cart");
  if (!addToCartButton || addToCartButton.disabled) return;

  const card = addToCartButton.closest(".product-card");
  const productId = card?.dataset?.productId;
  const quantity = 1;
  await addToCart(productId, quantity);
  if (!localStorage.getItem("accessToken")) {
    showPopup("Please Login");
  }
});

//view product button event listener
document.addEventListener("click", e => {
  const viewBtn = e.target.closest(".view-btn");
  if (!viewBtn) return;

  const card = viewBtn.closest(".product-card");
  const productId = card?.dataset?.productId;

  const isPagesDir = window.location.pathname.includes("/pages/");
  const baseUrl = isPagesDir ? "./product.html" : "./pages/product.html";
  const redirectUrl = productId ? `${baseUrl}?id=${productId}` : baseUrl;

  window.location.href = redirectUrl;
});

//favorites button event listener
document.addEventListener("click", async e => {
  const favoriteBtn = e.target.closest(".favorite-btn");
  if (!favoriteBtn) return;
  const card = favoriteBtn.closest(".product-card");
  const productId = card?.dataset?.productId;
  if (!productId) return;

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showPopup("Please Login");
    return;
  }

  const isCurrentlyFavorite = favoriteBtn.classList.contains("active");
  const svg = favoriteBtn.querySelector("svg");

  if (isCurrentlyFavorite) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.setAttribute("aria-label", "Add to favorites");
    if (svg) svg.setAttribute("fill", "none");

    const result = await removeFromFavorites(productId);
    if (!result) {
      favoriteBtn.classList.add("active");
      favoriteBtn.setAttribute("aria-label", "Remove from favorites");
      if (svg) svg.setAttribute("fill", "currentColor");
    }
  } else {
    favoriteBtn.classList.add("active");
    favoriteBtn.setAttribute("aria-label", "Remove from favorites");
    if (svg) svg.setAttribute("fill", "currentColor");

    const result = await addToFavorites(productId);
    if (!result) {
      favoriteBtn.classList.remove("active");
      favoriteBtn.setAttribute("aria-label", "Add to favorites");
      if (svg) svg.setAttribute("fill", "none");
    }
  }
});
