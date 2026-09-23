import { API_KEY } from "../../data/secret.js";
import { renderProductsHtml } from "../../shared/product-card.js";

export async function fetchFeaturedProducts() {
  let response = await fetch(
    "https://shopapi.stepacademy.ge/api/products/filter?InStock=true&MinRating=4&Take=4&Page=1",
    {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
      },
    },
  );
  let data = await response.json();
  return data.data.items;
}

renderFeaturedProducts();

async function renderFeaturedProducts() {
  let productsGridElement = document.querySelector(".featured-products-grid");
  let products = await fetchFeaturedProducts();
  productsGridElement.innerHTML = renderProductsHtml(products);
}
