import { API_KEY } from "./secret.js";

export async function fetchProductReviews(productId) {
  try {
    if (!productId) {
      throw new Error(
        "productId was not provided in order to fetch product reviews.",
      );
    }
    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/reviews/${productId}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Failed to fetch reviews, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to fetch product reviews, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    return result.data;
  } catch (err) {
    console.error(err);
  }
}
