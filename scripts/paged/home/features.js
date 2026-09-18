import { fetchFeaturedProducts } from "../../data/features.js";

renderFeaturedProducts();

async function renderFeaturedProducts() {
  let productsGridElement = document.querySelector(".featured-products-grid");
  let products = await fetchFeaturedProducts();
  let productsHtml = ``;
  console.log(products);
  products.forEach((product) => {
    let html = `
      <div class="product-card">
              <div class="card-image">
                <img src="${product.imageUrl}" alt="${product.name}" />
                <div class="quick-actions">
                  <button class="action-btn favorite-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      ></path>
                    </svg></button
                  ><button class="action-btn view-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      ></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="card-content">
                <div class="card-meta">
                  <span class="category">${product.category.name}</span
                  ><span class="brand">${product.brand}</span>
                </div>
                <div class="card-title">
                  <span>${product.name}</span>
                </div>
                <div class="card-rating">
                  <div class="stars">
                  
                  ${renderStars(product.rating)}
                     
                  </div>
                  <span class="rating-value">${product.rating.toFixed(1)}</span>
                </div>
                <div class="card-price"><span>USD ${product.price.toLocaleString()}</span></div>
              </div>
              <div class="card-footer">
                <button class="add-to-cart">
                  <svg
                    _ngcontent-ng-c193739674=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle
                      _ngcontent-ng-c193739674=""
                      cx="9"
                      cy="21"
                      r="1"
                    ></circle>
                    <circle
                      _ngcontent-ng-c193739674=""
                      cx="20"
                      cy="21"
                      r="1"
                    ></circle>
                    <path
                      _ngcontent-ng-c193739674=""
                      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                    ></path>
                  </svg>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
    `;
    productsHtml += html;
  });
  productsGridElement.innerHTML = productsHtml;
}

function renderStars(starCount) {
  let starsHTML = ``;
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starCount) >= i) {
      //add positive star svg
      starsHTML += `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="star filled"
        fill="currentColor"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        ></polygon>
      </svg>`;
    } else {
      //add negative star svg
      starsHTML += `<svg  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star" fill="none"><polygon  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
  }
  return starsHTML;
}
