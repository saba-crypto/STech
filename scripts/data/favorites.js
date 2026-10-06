import { showPopup, showSuccessPopup } from "../utils/showPopup.js";
import { apiRequest } from "./apiClient.js";

export async function fetchFavorites(take = 8, page = 1) {
  try {
    const result = await apiRequest(`/favorites?Take=${take}&Page=${page}`);
    return result ? result.data : null;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function addToFavorites(productId) {
  try {
    if (!productId) {
      console.error(
        "productId was not provided for the request when trying to add to favorites",
      );
      return;
    }

    const result = await apiRequest(`/favorites/${productId}`, {
      method: "POST",
    });
    console.log(result);
    if (result) {
      showSuccessPopup("Added to Favorites");
    }
    return result;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function removeFromFavorites(productId) {
  try {
    if (!productId) {
      throw new Error(
        "productId is undefined, failed to remove favorite product",
      );
    }

    const result = await apiRequest(`/favorites/${productId}`, {
      method: "DELETE",
    });
    if (result) {
      showSuccessPopup("Removed from Favorites");
    }
    return result;
  } catch (err) {
    console.error(err.message || err);
  }
}
