import {
  fetchCart,
  removeFromCart,
  editCartItemQuantity,
} from "../../../data/cart.js";

import { checkout } from "../../../data/user.js";
import { showPopup } from "../../../utils/showPopup.js";
import {
  renderEmptyState,
  removeEmptyState,
  EMPTY_CART_ICON,
} from "../../../shared/empty-state.js";
import { updateLoadMoreButton } from "../../../shared/load-more.js";

let currentPage = 1;

export function renderCart() {
  currentPage = 1;
  fetchCart(8, currentPage).then((cartData) => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      const cartSection = document.querySelector(".cart-items-section");
      const orderSummary = document.querySelector(".order-summary");
      if (cartSection) cartSection.style.display = "";
      if (orderSummary) orderSummary.style.display = "";

      const cartLayout = document.querySelector(".cart-layout");
      removeEmptyState(cartLayout);

      renderCartItems(cartData.items);
      renderOrderSummary(cartData);
      updateCartLoadMoreButton(cartData.hasMore);
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
  //elements
  const removeFromCartButtons = document.querySelectorAll(".remove-btn");
  const checkoutButton = document.querySelector(".checkout-btn");
  const clearCartButton = document.querySelector(".clear-cart-btn");
  const quantityMinusButtons = document.querySelectorAll(".qty-btn.minus");
  const quantityPlusButtons = document.querySelectorAll(".qty-btn.plus");
  const quantityValues = document.querySelectorAll(".qty-value");
  const totalItemsPriceElements = document.querySelectorAll(".item-total");
  const itemPrices = document.querySelectorAll(".item-price");

  //remove from cart
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

  //checkout button
  if (checkoutButton && !checkoutButton.dataset.listenerAttached) {
    checkoutButton.dataset.listenerAttached = "true";
    checkoutButton.addEventListener("click", async () => {
      await checkout();
      renderCart();
    });
  }

  //clear all cart items button
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

  //increase quantity
  if (quantityMinusButtons) {
    quantityMinusButtons.forEach((button, i) => {
      button.addEventListener("click", async (e) => {
        let itemTotalPrice = Number(
          totalItemsPriceElements[i].dataset.totalPrice,
        );
        let singleItemPrice = Number(itemPrices[i].dataset.price);
        const cartItemId = e.target.closest(".cart-item")?.dataset.id;
        let currentQuantity = e.target.closest(".cart-item").dataset.quantity;
        if (cartItemId && currentQuantity && currentQuantity > 1) {
          quantityValues[i].innerText = currentQuantity - 1;
          totalItemsPriceElements[i].innerHTML =
            `$${(itemTotalPrice -= singleItemPrice).toLocaleString()}`;

          await editCartItemQuantity(cartItemId, Number(currentQuantity) - 1);
          renderCart();
        } else {
          console.error(
            "Unexpected error occurred while trying to decrease cart item quantity, provided values for editing cart quantity are invalid.",
          );
        }
      });
    });
  }

  //decrease quantity
  if (quantityPlusButtons) {
    quantityPlusButtons.forEach((button, i) => {
      button.addEventListener("click", async (e) => {
        let itemTotalPrice = Number(
          totalItemsPriceElements[i].dataset.totalPrice,
        );
        let singleItemPrice = Number(itemPrices[i].dataset.price);
        const cartItemId = e.target.closest(".cart-item")?.dataset.id;
        let currentQuantity = Number(
          e.target.closest(".cart-item")?.dataset.quantity,
        );
        if (cartItemId && currentQuantity) {
          quantityValues[i].innerText = `${currentQuantity + 1}`;
          totalItemsPriceElements[i].innerHTML =
            `$${(itemTotalPrice += singleItemPrice).toLocaleString()}`;

          await editCartItemQuantity(cartItemId, currentQuantity + 1);
          renderCart();
        } else {
          console.error(
            "Unexpected error occurred while trying to decrease cart item quantity, provided values for editing cart quantity are invalid.",
          );
        }
      });
    });
  }
}

function displayEmptyCartContainer() {
  const cartSection = document.querySelector(".cart-items-section");
  const orderSummary = document.querySelector(".order-summary");
  if (cartSection) cartSection.style.display = "none";
  if (orderSummary) orderSummary.style.display = "none";

  updateCartLoadMoreButton(false);

  const cartLayout = document.querySelector(".cart-layout");
  renderEmptyState(cartLayout, {
    iconSvg: EMPTY_CART_ICON,
    title: "Your cart is empty",
    description: "Start adding products to your cart to see them here.",
    subtitleSelector: ".cart-page-subtitle",
    subtitleText: "0 items in your cart",
  });
}

function updateCartLoadMoreButton(hasMore) {
  const cartSection = document.querySelector(".cart-items-section");
  const continueShopping = cartSection?.querySelector(".continue-shopping");

  updateLoadMoreButton({
    container: cartSection,
    hasMore,
    insertBefore: continueShopping,
    onLoadMore: handleLoadMore,
  });
}

async function handleLoadMore() {
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
    updateCartLoadMoreButton(data.hasMore);
  }
}

function renderCartCards(cartItems) {
  return cartItems
    .map((cartItem) => {
      const isMinusQuantityDisabled =
        cartItem.quantity === 1 || cartItem.quantity < 1 ? "disabled" : "";

      return `
      <article class="cart-item" data-quantity="${cartItem.quantity}" data-can-delete="${cartItem.product.canDelete}" data-id="${cartItem.id}">
        <div class="item-image">
          <img src="${cartItem.product.imageUrl}" alt="${cartItem.product.name}">
        </div>
        <div class="item-info">
          <a href="./product.html?id=${cartItem.product.id}" class="item-name">${cartItem.product.name}</a>
          <span class="item-brand">${cartItem.product.brand}</span>
          <div class="item-price-mobile">$${cartItem.product.price.toLocaleString()}</div>
        </div>
        <div data-price="${cartItem.product.price}" class="item-price">$${cartItem.product.price.toLocaleString()}</div>
        <div class="item-quantity">
          <button type="button" class="qty-btn minus" ${isMinusQuantityDisabled}  aria-label="Decrease quantity">
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
        <div data-total-price="${cartItem.totalPrice}" class="item-total">$${cartItem.totalPrice.toLocaleString()}</div>
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
