import { apiRequest } from "./apiClient.js";

export async function fetchProduct(productId) {
  try {
    if (!productId) {
      throw new Error("product id was not provided for fetchProduct function");
    }
    const result = await apiRequest(`/products/${productId}`);
    return result.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
