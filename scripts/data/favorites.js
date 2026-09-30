import { API_KEY } from "./secret.js";
import { fetchUser } from "./user.js";
import { showPopup } from "../utils/showPopup.js";

export async function fetchFavorites(take = 8, page = 1) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";
    const accessToken = localStorage.getItem("accessToken");

    const userResult = await fetchUser();
    if (!accessToken || !userResult) {
      window.location.href = loginUrl;
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/favorites?Take=${take}&Page=${page}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`unable to fetch favorites.`);
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error(err.message);
  }
}

export async function addToFavorites(productId) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");
    if (!productId) {
      console.error(
        "productId was not provided for the request when trying to add to favorites",
      );
    }
    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/favorites/${productId}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      const result = await response.json();
      showPopup(result.detail);
    }
  } catch (err) {
    console.error(err.message);
  }
}
