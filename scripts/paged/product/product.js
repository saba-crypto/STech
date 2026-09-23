import "../../shared/header.js";
import { fetchProduct } from "../../data/product.js";
import { renderMainProductInfo } from "./mainProductInfo.js";
import { renderReviews } from "./Reviews.js";
import { renderRelatedProducts } from "./relatedProducts.js";
import { renderSpecifications } from "./specifications.js";
import { renderDescription } from "./description.js";

const params = new URLSearchParams(window.location.search);

async function renderProductsPage() {
  const productData = await fetchProduct();
  renderMainProductInfo(productData);
  renderReviews(productData);
}

renderProductsPage();
