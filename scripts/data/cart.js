import { showPopup, showSuccessPopup } from "../utils/showPopup.js";
import { API_KEY } from "./secret.js";

export async function fetchCart(take = 8, page = 1) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/cart?Take=${take}&Page=${page}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(
        `Error occurred while fetching cart. error message: ${result.detail || result.title}`,
      );
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function addToCart(productId, quantity) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }

    if (!productId || quantity <= 0) {
      throw new Error(
        "couldn't add product to cart, productId or quantity is not valid",
      );
    }
    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/cart/add-to-cart`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ productId: productId, quantity: quantity }),
      },
    );
    if (!response.ok) {
      const result = await response.json();
      if (result.detail || result.title) {
        showPopup(result.detail);
        throw new Error(
          `failed to add product to cart, error message: ${result.detail || result.title}`,
        );
      }
    }
    showSuccessPopup("Item added to cart!");
  } catch (err) {
    console.error(err.message);
  }
}

export async function removeFromCart(productId) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }
    if (!productId) {
      throw new Error(
        "couldn't remove product from cart, productId is undefined",
      );
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/cart/remove-from-cart/${productId}`,
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

      throw new Error(
        `failed to remove product from the cart, error message: ${result.detail || result.title}`,
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}

export async function editCartItemQuantity(itemId, quantity) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");

    if (!itemId || !quantity || quantity < 1) {
      throw new Error(
        "Couldn't edit product quantity, itemId or quantity provided is not valid",
      );
    }

    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }

    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/cart/edit-quantity",
      {
        method: "PUT",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: itemId,
          quantity: quantity,
        }),
      },
    );
    if (!response.ok) {
      const result = await response.json();
      throw new Error(
        `Couldn't update cart item quantity, server responded with error: ${result.detail || result.title}`,
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}
