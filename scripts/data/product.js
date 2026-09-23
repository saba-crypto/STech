import { API_KEY } from "./secret.js";
export async function fetchProduct(productId) {
  try {
    if (!productId) {
      throw new Error("product id was not provided for fetchProduct function");
    }
    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/products/${productId}`,
      {
        headers: { "X-API-KEY": API_KEY },
      },
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}
