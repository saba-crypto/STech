import { showSuccessPopup } from "../utils/showPopup.js";
import { apiRequest } from "./apiClient.js";

export async function fetchProductReviews(productId) {
  try {
    if (!productId) {
      throw new Error(
        "productId was not provided in order to fetch product reviews.",
      );
    }
    const result = await apiRequest(`/reviews/${productId}`);
    return result ? result.data : null;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function addReview(productId, rate) {
  try {
    if (!productId || !rate) {
      throw new Error(
        "productId or/and rate was not provided in order to add product review.",
      );
    }

    await apiRequest("/reviews", {
      method: "POST",
      body: { productId, rate },
    });

    showSuccessPopup("Review was Added Successfully");
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function changeReview(reviewId, rate) {
  try {
    if (!reviewId || !rate) {
      throw new Error(
        "reviewId or/and rate was not provided in order to update product review.",
      );
    }

    await apiRequest("/reviews", {
      method: "PUT",
      body: { reviewId, rate },
    });

    showSuccessPopup("Review was Updated Successfully");
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function deleteReview(productId) {
  try {
    if (!productId) {
      throw new Error("productId was not provided in order to delete");
    }

    await apiRequest(`/reviews/${productId}`, {
      method: "DELETE",
    });

    showSuccessPopup("Review was Deleted Successfully");
  } catch (err) {
    console.error(err.message || err);
  }
}