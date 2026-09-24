import "../../shared/header.js";
import { fetchProduct } from "../../data/product.js";
import { renderMainProductInfo } from "./mainProductInfo.js";
import { renderReviews } from "./Reviews.js";
import { renderRelatedProducts } from "./relatedProducts.js";
import { renderSpecifications } from "./specifications.js";
import { renderDescription } from "./description.js";
import { fetchProductReviews } from "../../data/productReviews.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
async function renderProductsPage(productId) {
  const productData = await fetchProduct(productId);
  const productReviewsData = await fetchProductReviews(productId);
  renderMainProductInfo(productData, productReviewsData);
  renderReviews(productData, productReviewsData);
}

renderProductsPage(productId);
