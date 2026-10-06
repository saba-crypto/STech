import "./featuredProducts.js";
import "./newProducts.js";
import "./categories.js";
import "../../shared/header.js";
import "../../shared/chatbot.js";

const shopBtns = document.querySelectorAll(".shop-btn");
if (shopBtns) {
  shopBtns.forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "./pages/shop.html";
    });
  });
}

const newArrivalsButton = document.querySelector(".new-arrivals-btn");
const newArrivalsSection = document.getElementById("s/section5");
if (newArrivalsButton && newArrivalsSection) {
  newArrivalsButton.addEventListener("click", () => {
    newArrivalsSection.scrollIntoView();
  });
}
