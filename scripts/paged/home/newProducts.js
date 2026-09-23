import { API_KEY } from "../../data/secret.js";
import { renderProductsHtml } from "../../shared/product-card.js";
export async function fetchNewProducts() {
  let response = await fetch(
    "https://shopapi.stepacademy.ge/api/products/filter?InStock=true&SortBy=createdAt&SortDescending=true&Take=4",
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
renderNewProducts();

async function renderNewProducts() {
  let productsGridElement = document.querySelector(".new-products-grid");
  let products = await fetchNewProducts();
  products.forEach((product) => {
    product.isNew = true;
  });
  console.log(products);
  productsGridElement.innerHTML = renderProductsHtml(products);
}
