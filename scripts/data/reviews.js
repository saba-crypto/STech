import { displayErrorPopups } from "../utils/displayErrors.js";
import { showPopup, showSuccessPopup } from "../utils/showPopup.js";

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

export async function addReview(productId, rate) {
  try {
    if (!productId || !rate) {
      throw new Error(
        "productId or/and rate was not provided in order to add product review.",
      );
    }
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showPopup("Failed to add Review, User is Unauthenticated");
      throw new Error(
        "Failed to add a product review. user is unauthenticated",
      );
    }

    const response = await fetch(`https://shopapi.stepacademy.ge/api/reviews`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, rate }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Failed to add review, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to add product review, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    showSuccessPopup("Review was Added Successfully");
  } catch (err) {
    console.error(err.message);
  }
}

export async function changeReview(reviewId, rate) {
  try {
    if (!reviewId || !rate) {
      throw new Error(
        "reviewId or/and rate was not provided in order to update product review.",
      );
    }
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showPopup("Failed to update Review, User is Unauthenticated");
      throw new Error(
        "Failed to update product review. user is unauthenticated",
      );
    }

    const response = await fetch(`https://shopapi.stepacademy.ge/api/reviews`, {
      method: "PUT",
      headers: {
        "X-API-KEY": API_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewId, rate }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Failed to update reviews, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to update product review, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    showSuccessPopup("Review was Updated Successfully");
  } catch (err) {
    console.error(err.message);
  }
}

export async function deleteReview(productId) {
  try {
    if (!productId) {
      throw new Error(
        "productId was not provided in order to delete",
      );
    }
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showPopup("Failed to delete Review, User is Unauthenticated");
      throw new Error(
        "Failed to delete product review. user is unauthenticated",
      );
    }

    const response = await fetch(`https://shopapi.stepacademy.ge/api/reviews/${productId}`, {
      method: "DELETE",
      headers: {
        "X-API-KEY": API_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Failed to delete reviews, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to delete product review, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    showSuccessPopup("Review was Deleted Successfully");
  } catch (err) {
    console.error(err.message);
  }
}