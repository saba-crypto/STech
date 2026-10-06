import { showSuccessPopup } from "../utils/showPopup.js";
import { apiRequest } from "./apiClient.js";

export async function fetchCart(take = 8, page = 1) {
  try {
    const result = await apiRequest(`/cart?Take=${take}&Page=${page}`);
    return result ? result.data : null;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function addToCart(productId, quantity) {
  try {
    if (!productId || quantity <= 0) {
      throw new Error(
        "couldn't add product to cart, productId or quantity is not valid",
      );
    }

    await apiRequest("/cart/add-to-cart", {
      method: "POST",
      body: { productId, quantity },
    });

    showSuccessPopup("Item added to cart!");
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function removeFromCart(productId) {
  try {
    if (!productId) {
      throw new Error(
        "couldn't remove product from cart, productId is undefined",
      );
    }

    await apiRequest(`/cart/remove-from-cart/${productId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function editCartItemQuantity(itemId, quantity) {
  try {
    if (!itemId || !quantity || quantity < 1) {
      throw new Error(
        "Couldn't edit product quantity, itemId or quantity provided is not valid",
      );
    }

    await apiRequest("/cart/edit-quantity", {
      method: "PUT",
      body: { itemId, quantity },
    });
  } catch (err) {
    console.error(err.message || err);
  }
}
