import { renderStars } from "../../utils/renderRatingStars.js";
import { addToCart } from "../../data/cart.js";
import { showPopup } from "../../utils/showPopup.js";
import { addToFavorites, removeFromFavorites } from "../../data/favorites.js";
const productGalleryContainer = document.querySelector(".product-gallery");
const productInfoContainer = document.querySelector(".product-info");

let productQuantity = 1;

export function renderMainProductInfo(product, reviews) {
  productGalleryContainer.innerHTML = renderGallery(product);
  productInfoContainer.innerHTML = renderProductInfo(product, reviews);
  addThumbnailLister(product, reviews);
  addQuantityControllers();
  const addToCartButton = document.querySelector(".btn-add-cart");
  const favoriteButton = document.querySelector(".btn-favorite");

  //add to cart
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const productId = addToCartButton.dataset.productId;
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        showPopup("Please Register First");
        return;
      }
      addToCart(productId, productQuantity);
    });
  }
  //favorite
  if (favoriteButton) {
    favoriteButton.addEventListener("click", async () => {
      const productId = favoriteButton.dataset.productId;
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        showPopup("Please Login");
        return;
      }

      const isCurrentlyFavorite = favoriteButton.classList.contains("active");
      const svg = favoriteButton.querySelector("svg");

      if (isCurrentlyFavorite) {
        favoriteButton.classList.remove("active");
        favoriteButton.setAttribute("aria-label", "Add to wishlist");
        if (svg) svg.setAttribute("fill", "none");

        const result = await removeFromFavorites(productId);
        if (!result) {
          favoriteButton.classList.add("active");
          favoriteButton.setAttribute("aria-label", "Remove from wishlist");
          if (svg) svg.setAttribute("fill", "currentColor");
        }
      } else {
        favoriteButton.classList.add("active");
        favoriteButton.setAttribute("aria-label", "Remove from wishlist");
        if (svg) svg.setAttribute("fill", "currentColor");

        const result = await addToFavorites(productId);
        if (!result) {
          favoriteButton.classList.remove("active");
          favoriteButton.setAttribute("aria-label", "Add to wishlist");
          if (svg) svg.setAttribute("fill", "none");
        }
      }
    });
  }
}

let currentlySelectedImage;

//gallery
function renderGallery(product) {
  if (!currentlySelectedImage) {
    currentlySelectedImage = product.imageUrl;
  }
  return `
  <div class="product-gallery">
    <div class="main-image">
      <img class="product-image" src="${currentlySelectedImage}" alt="${product.name}">
    </div>
    <div class="thumbnail-list">
    
    ${renderGalleryImages(product.imageUrls, product)}
    </div>
  </div>
  `;
}

function renderGalleryImages(images, product) {
  return images
    .map((image, i) => {
      const isActive = image === currentlySelectedImage ? "active" : "";
      return `
      <div class="thumbnail ${isActive}">
        <img class="thumbnail-image" src="${image}" alt="${product.name} - View ${i + 2}">
      </div>
      `;
    })
    .join("");
}

function addThumbnailLister(product, reviews) {
  document.querySelectorAll(".thumbnail").forEach(thumbnail => {
    thumbnail.addEventListener("click", e => {
      const imageUrl = e.target.closest(".thumbnail-image").src;
      if (!imageUrl) {
        return;
      }
      currentlySelectedImage = imageUrl;
      renderMainProductInfo(product, reviews);
    });
  });
}

//product info
function renderProductInfo(product, reviews) {
  const isDisabled = product.stock === 0 ? "disabled" : "";
  const outOfStock = product.stock === 0 ? true : false;
  return `

      <div class="product-meta">
        <span class="category">${product.category.name}</span>
        <span class="brand">${product.brand}</span>
      </div>

      <h1 class="product-title">${product.name}</h1>

      <div class="product-rating">
        <div class="stars">
        ${renderStars(product.rating)}
        

        </div>
        <span class="rating-value">${product.rating.toFixed(1)}</span>
        <span class="review-count">(${reviews.totalCount} reviews)</span>
      </div>

      <div class="product-price">
        <span class="current-price">$${product.price.toLocaleString()}</span>
      </div>

      <div class="stock-status">
      ${
        outOfStock
          ? `<span class="stock-badge out-of-stock">
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
          Sold out
        </span>`
          : `<span class="stock-badge in-stock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          in Stock(${product.stock} available)
        </span>`
      }
        
      </div>

      <div class="product-description-short">
        <p>
          ${product.description}
        </p>
      </div>

      <div class="quantity-selector">
        <label>Quantity</label>
        <div class="quantity-controls">
          <button ${isDisabled} class="qty-btn quantity decrease-quantity" type="button" aria-label="Decrease quantity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="qty-value">${productQuantity}</span>
          <button ${isDisabled} class="qty-btn add-quantity" type="button" aria-label="Increase quantity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button ${isDisabled} class="btn-add-cart" data-product-id="${product.id}"  type="button" >
          ${
            outOfStock
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
          <span>${outOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>
        <button data-product-id="${product.id}" class="btn-favorite ${product.isFavorite ? "active" : ""}" type="button" aria-label="${product.isFavorite ? "Remove from wishlist" : "Add to wishlist"}">
          <svg viewBox="0 0 24 24" fill="${product.isFavorite ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

  `;
}

function addQuantityControllers() {
  const addQuantityButton = document.querySelector(".add-quantity");
  const decreaseQuantityButton = document.querySelector(".decrease-quantity");
  const quantityValue = document.querySelector(".qty-value");
  addQuantityButton.addEventListener("click", () => {
    if (productQuantity < 50 && quantityValue) {
      productQuantity++;
      quantityValue.innerHTML = productQuantity;
    }
  });
  decreaseQuantityButton.addEventListener("click", () => {
    if (productQuantity > 1 && quantityValue) {
      productQuantity--;
      quantityValue.innerHTML = productQuantity;
    }
  });
}
