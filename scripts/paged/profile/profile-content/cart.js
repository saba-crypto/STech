import { fetchCart, removeFromCart } from "../../../data/cart.js";
import { checkout } from "../../../data/checkout.js";
import { showPopup } from "../../../utils/showPopup.js";

let currentPage = 1;

export function renderCart() {
  currentPage = 1;
  fetchCart(8, currentPage).then((cartData) => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      renderCartItems(cartData.items);
      renderOrderSummary(cartData);
      updateLoadMoreButton(cartData.hasMore);
      addEventListeners();
    } else {
      displayEmptyCartContainer();
    }
  });
}

function renderCartItems(cartItems) {
  const cartItemsElement = document.querySelector(".cart-items");
  if (!cartItemsElement) return;

  cartItemsElement.innerHTML = renderCartCards(cartItems);
}

function renderOrderSummary(cartData) {
  const summaryContainer = document.querySelector(".summary-card");
  if (!summaryContainer) return;

  let totalCost = 0;
  let totalCount = 0;
  cartData.items.forEach((item) => {
    totalCost += item.totalPrice;
    totalCount += item.quantity;
  });

  const subtitle = document.querySelector(".cart-page-subtitle");
  if (subtitle) {
    subtitle.innerText = `${totalCount} items in your cart`;
  }

  summaryContainer.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-rows">
        <div class="summary-row">
          <span>Subtotal (${totalCount} items)</span>
          <span>$${totalCost.toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span class="shipping-value"><span class="free">FREE</span></span>
        </div>
        <div class="shipping-notice">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>You qualify for free shipping!</span>
        </div>
      </div>

      <div class="summary-total">
        <span>Total</span>
        <span class="total-value">$${totalCost.toLocaleString()}</span>
      </div>

      <button type="button" class="checkout-btn">
        <span>Proceed to Checkout</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </button>

      <div class="secure-badge">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span>Secure checkout guaranteed</span>
      </div>
  `;
}

function addEventListeners() {
  const removeFromCartButtons = document.querySelectorAll(".remove-btn");
  const checkoutButton = document.querySelector(".checkout-btn");
  const clearCartButton = document.querySelector(".clear-cart-btn");

  if (removeFromCartButtons) {
    removeFromCartButtons.forEach((button) => {
      if (!button.dataset.listenerAttached) {
        button.dataset.listenerAttached = "true";
        button.addEventListener("click", async (e) => {
          const cartItemId = e.target.closest(".cart-item")?.dataset.id;
          const canDelete = e.target.closest(".cart-item")?.dataset.canDelete;
          if (cartItemId && canDelete) {
            await removeFromCart(cartItemId);
            renderCart();
          }
        });
      }
    });
  }

  if (checkoutButton && !checkoutButton.dataset.listenerAttached) {
    checkoutButton.dataset.listenerAttached = "true";
    checkoutButton.addEventListener("click", async () => {
      await checkout();
      renderCart();
    });
  }

  if (clearCartButton && !clearCartButton.dataset.listenerAttached) {
    clearCartButton.dataset.listenerAttached = "true";
    clearCartButton.addEventListener("click", async () => {
      const cartItems = document.querySelectorAll(".cart-item");
      for (const item of cartItems) {
        const productId = item.dataset.id;
        if (productId) {
          await removeFromCart(productId);
        } else {
          showPopup("Failed to remove from cart, please try again");
        }
      }
      renderCart();
    });
  }
}

function displayEmptyCartContainer() {
  const cartLayout = document.querySelector(".cart-layout");
  const subtitle = document.querySelector(".cart-page-subtitle");

  if (subtitle) {
    subtitle.textContent = "0 items in your cart";
  }

  updateLoadMoreButton(false);

  if (!cartLayout) return;

  cartLayout.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>Start adding products to your cart to see them here.</p>
      <a href="./shop.html" class="browse-products-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <span>Browse Products</span>
      </a>
    </div>
  `;
}

function updateLoadMoreButton(hasMore) {
  const cartSection = document.querySelector(".cart-items-section");
  if (!cartSection) return;

  let loadMoreSection = cartSection.querySelector(".load-more-section");

  if (hasMore) {
    if (!loadMoreSection) {
      loadMoreSection = document.createElement("div");
      loadMoreSection.className = "load-more-section";
      loadMoreSection.innerHTML = `
        <button type="button" class="load-more-btn">Load More</button>
      `;
      const continueShopping = cartSection.querySelector(".continue-shopping");
      if (continueShopping) {
        cartSection.insertBefore(loadMoreSection, continueShopping);
      } else {
        cartSection.appendChild(loadMoreSection);
      }

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
  const data = await fetchCart(8, currentPage);

  if (data && data.items) {
    const cartItemsElement = document.querySelector(".cart-items");
    if (cartItemsElement) {
      cartItemsElement.insertAdjacentHTML(
        "beforeend",
        renderCartCards(data.items),
      );
      addEventListeners();
    }
    updateLoadMoreButton(data.hasMore);
  } else if (loadMoreBtn) {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = "Load More";
  }
}

function renderCartCards(cartItems) {
  return cartItems
    .map((cartItem) => {
      return `
      <article class="cart-item" data-can-delete="${cartItem.product.canDelete}" data-id="${cartItem.id}">
        <div class="item-image">
          <img src="${cartItem.product.imageUrl}" alt="${cartItem.product.name}">
        </div>
        <div class="item-info">
          <a href="./product.html?id=${cartItem.product.id}" class="item-name">${cartItem.product.name}</a>
          <span class="item-brand">${cartItem.product.brand}</span>
          <div class="item-price-mobile">$${cartItem.product.price.toLocaleString()}</div>
        </div>
        <div class="item-price">$${cartItem.product.price.toLocaleString()}</div>
        <div class="item-quantity">
          <button type="button" class="qty-btn minus" aria-label="Decrease quantity">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="qty-value" aria-label="Current quantity">${cartItem.quantity}</span>
          <button type="button" class="qty-btn plus" aria-label="Increase quantity">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="item-total">$${cartItem.totalPrice.toLocaleString()}</div>
        <button type="button" class="remove-btn" aria-label="Remove item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </article>
    `;
    })
    .join("");
}
