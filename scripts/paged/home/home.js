import "./featuredProducts.js";
import "./newProducts.js";
import "./categories.js";
import "../../shared/header.js";

const shopBtns = document.querySelectorAll(".shop-btn");
if (shopBtns) {
  shopBtns.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "./pages/shop.html";
    });
  });
}
