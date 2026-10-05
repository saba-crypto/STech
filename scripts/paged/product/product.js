import "../../shared/header.js";
import { fetchProduct } from "../../data/product.js";
import { renderMainProductInfo } from "./mainProductInfo.js";
import { renderReviews } from "./reviews.js";
import { fetchProductReviews } from "../../data/reviews.js";
import { renderSpecifications } from "./specifications.js";
import { renderDescription } from "./description.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const panels = document.querySelectorAll(".content-panel");
let currentTab = window.location.hash.replace("#", "") || "description";


async function renderProductsPage(productId) {
  const productData = await fetchProduct(productId);
  const productReviewsData = await fetchProductReviews(productId);
  document.title = `STeck | ${productData.name}`
  renderMainProductInfo(productData, productReviewsData);
  handleTabNavigation();
  await renderReviews(productId, productReviewsData);
  renderSpecifications(productData);
  renderDescription(productData)
}

switchTab(currentTab);
renderProductsPage(productId);
renderCorrectTab();

function switchTab(tab) {
  const validTabs = ["description", "specifications", "reviews"];

  if (!validTabs.includes(tab)) {
    window.location.hash = "description";
    return;
  }
  window.location.hash = tab;
  renderCorrectTab();
}

function renderCorrectTab() {
  const tab = window.location.hash.replace("#", "");
  if (panels) {
    panels.forEach((panel) => {
      if (panel.id === `tab-${tab}`) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });
  }
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "");
  switchTab(hash);
});

const tabButtons = document.querySelectorAll(".details-tab-btn");
updateTabsNavigation();

function handleTabNavigation() {
  if (tabButtons) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tabPage;

        switchTab(tab);
        updateTabsNavigation();
      });
    });
  }
}

function updateTabsNavigation() {
  const currentTab = window.location.hash.replace("#", "");
  tabButtons.forEach((button) => {
    const tab = button.dataset.tabPage;
    if (currentTab === tab) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
