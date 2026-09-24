import { renderStars } from "../../utils/renderRatingStars.js";

const productGalleryContainer = document.querySelector(".product-gallery");
const productInfoContainer = document.querySelector(".product-info");

export function renderMainProductInfo(product, reviews) {
  productGalleryContainer.innerHTML = renderGallery(product);
  productInfoContainer.innerHTML = renderProductInfo(product, reviews);
  addThumbnailLister(product, reviews);
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
  document.querySelectorAll(".thumbnail").forEach((thumbnail) => {
    thumbnail.addEventListener("click", (e) => {
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
        <span class="current-price">$${product.price}</span>
      </div>

      <div class="stock-status">
        <span class="in-stock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          In Stock (${product.stock} available)
        </span>
      </div>

      <div class="product-description-short">
        <p>
          ${product.description}
        </p>
      </div>

      <div class="quantity-selector">
        <label>Quantity</label>
        <div class="quantity-controls">
          <button class="qty-btn" type="button" aria-label="Decrease quantity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="qty-value">1</span>
          <button class="qty-btn" type="button" aria-label="Increase quantity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-add-cart" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Add to Cart</span>
        </button>
        <button class="btn-favorite" type="button" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

  `;
}
