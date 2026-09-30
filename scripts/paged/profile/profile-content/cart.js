import { fetchCart } from "../../../data/cart.js";
export function renderCart() {
  fetchCart().then((cartData) => {
    renderCartItems(cartData.items);
    renderOrderSummary();
  });
}

function renderCartItems(cartItems) {
  console.log(cartItems);
  const cartItemsElement = document.querySelector(".cart-items");
  cartItemsElement.innerHTML = cartItems
    .map((cartItem) => {
      return `
      <article class="cart-item" data-id="${cartItem.id}">
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

function renderOrderSummary() {}
