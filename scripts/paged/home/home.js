import "./featuredProducts.js";
import "./newProducts.js";
import "../../shared/header.js";

const shopBtn = document.querySelector(".shop-btn");
if (shopBtn) {
  shopBtn.addEventListener("click", () => {
    window.location.href = "./pages/shop.html";
  });
}
