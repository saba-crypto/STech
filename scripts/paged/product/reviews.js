import {
  addReview,
  changeReview,
  deleteReview,
  fetchProductReviews,
} from "../../data/reviews.js";
import { renderStars } from "../../utils/renderRatingStars.js";

let currentProductId = null;
let hasUserReviewed = false;
let currentUserReviewId = null;
let currentUserRating = 0;

export async function renderReviews(productId, reviews) {
  if (!productId || !reviews) {
    console.error(
      "productId or/and reviews was not provided for rendering reviews for renderReviews function",
    );
    return;
  }

  currentProductId = productId;

  const totalReviewsBadge = document.querySelector(".reviews-badge");
  if (totalReviewsBadge) {
    totalReviewsBadge.innerText = reviews.totalCount;
    totalReviewsBadge.setAttribute("aria-label", `${reviews.totalCount} reviews`);
  }

  const reviewCountEl = document.querySelector(".product-info .review-count");
  if (reviewCountEl && reviews.totalCount !== undefined) {
    reviewCountEl.textContent = `(${reviews.totalCount} reviews)`;
  }

  renderReviewsList(reviews.items, productId);
  renderRatingSummary(reviews);
  initReviewModal(productId);
  renderAddReviewContainer();
}

function renderReviewsList(reviewItems, productId) {
  const reviewsList = document.querySelector(".reviews-list");
  if (!reviewsList) {
    return;
  }

  hasUserReviewed = false;
  currentUserReviewId = null;
  currentUserRating = 0;

  reviewsList.innerHTML = reviewItems
    .map((review) => {
      const userId = JSON.parse(sessionStorage.getItem("userId"));
      const isYou = review.user.id === userId;
      if (isYou) {
        hasUserReviewed = true;
        currentUserReviewId = review.id;
        currentUserRating = review.rating;
      }

      const formattedDate = new Date(review.createdAt).toLocaleDateString();
      return `
    <article data-id="${review.id}" class="review-item ${isYou ? "my-review" : ""}">
      <header class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">
            <img src="${review.user.details.pictureUrl}" alt="${review.user.firstName.charAt(0)}" class="reviewer-avatar-initial" /> 
          </div>
          <div class="reviewer-details">
            <h4 class="reviewer-name">${review.user.firstName} ${review.user.lastName}</h4>
            <time class="review-date" datetime="${formattedDate}">${formattedDate}</time>
          </div>
        </div>
        <div class="review-header-right">
          <div class="rating-stars" aria-label="Rating: ${review.rating.toFixed(0)} out of 5 stars">
          ${renderStars(review.rating)}
          </div>
          ${
            isYou
              ? `
            <div class="review-actions">
              <span class="badge">You</span>
              <button type="button" class="delete-review-btn" aria-label="Delete review">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `
              : ""
          }
        </div>
      </header>
    </article>
    `;
    })
    .join("");

  const deleteButtons = reviewsList.querySelectorAll(".delete-review-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reviewItem = btn.closest(".review-item");
      const reviewId = reviewItem ? reviewItem.dataset.id : null;
      if (reviewId) {
        await deleteReview(reviewId);
        const updatedReviews = await fetchProductReviews(currentProductId);
        if (updatedReviews) {
          await renderReviews(currentProductId, updatedReviews);
        }
      }
    });
  });
}

function renderRatingSummary(ratingInfo) {
  const ratingSummary = document.querySelector(".rating-summary");
  const averageRating = calculateAverageRating(
    ratingInfo.items,
    ratingInfo.totalCount,
  );
  const reviewRatingCountData = calculateRatingCount(ratingInfo.items); //calculates how many 1-5 star reviews are written.

  ratingSummary.innerHTML = `
    <div class="summary-left">
      <div class="average-rating">${averageRating || 0}</div>
      <div class="rating-stars" aria-label="Average rating: ${averageRating || 0} out of 5 stars">
        ${renderStars(averageRating)} 
      </div>
      <p class="total-reviews">Based on ${ratingInfo.totalCount} reviews</p>
    </div>
    <div class="summary-right">
      <div class="rating-bar">
        <span class="star-label">5 ★</span>
        <div class="bar-container">
          <div style="width: ${calculateRatingCountPercentage(
            reviewRatingCountData.fiveStarRatings,
            ratingInfo.totalCount,
          )}%;" class="bar-fill"></div>
        </div>
        <span class="bar-count">${reviewRatingCountData.fiveStarRatings}</span>
      </div>
      <div class="rating-bar">
        <span class="star-label">4 ★</span>
        <div class="bar-container">
          <div style="width: ${calculateRatingCountPercentage(
            reviewRatingCountData.fourStarRatings,
            ratingInfo.totalCount,
          )}%;" class="bar-fill "></div>
        </div>
        <span class="bar-count">${reviewRatingCountData.fourStarRatings}</span>
      </div>
      <div class="rating-bar">
        <span class="star-label">3 ★</span>
        <div class="bar-container">
          <div style="width: ${calculateRatingCountPercentage(
            reviewRatingCountData.threeStarRatings,
            ratingInfo.totalCount,
          )}%;" class="bar-fill"></div>
        </div>
        <span class="bar-count">${reviewRatingCountData.threeStarRatings}</span>
      </div>
      <div class="rating-bar">
        <span class="star-label">2 ★</span>
        <div class="bar-container">
          <div style="width: ${calculateRatingCountPercentage(
            reviewRatingCountData.twoStarRatings,
            ratingInfo.totalCount,
          )}%;" class="bar-fill"></div>
        </div>
        <span class="bar-count">${reviewRatingCountData.twoStarRatings}</span>
      </div>
      <div class="rating-bar">
        <span class="star-label">1 ★</span>
        <div class="bar-container">
          <div style="width: ${calculateRatingCountPercentage(
            reviewRatingCountData.oneStarRatings,
            ratingInfo.totalCount,
          )}%;" class="bar-fill"></div>
        </div>
        <span class="bar-count">${reviewRatingCountData.oneStarRatings}</span>
      </div>
    </div>
              
  `;
}

function renderAddReviewContainer() {
  const promptContainer = document.querySelector(".auth-prompt");
  const accessToken = localStorage.getItem("accessToken");

  if (promptContainer) {
    promptContainer.innerHTML = `
    ${
      accessToken
        ? `<button type="button" class="write-review-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>${hasUserReviewed ? "Change Review" : "Write a Review"}</button>`
        : `
      <p class="auth-prompt-text">
        Please <a href="./login.html" class="auth-prompt-link">login</a> to write a review.
      </p>
        `
    }
    `;
  }
}

let selectedRating = 0;
let isModalInitialized = false;

function initReviewModal(productId) {
  if (productId) {
    currentProductId = productId;
  }

  const modal = document.getElementById("review-modal");
  if (!modal || isModalInitialized) {
    return;
  }

  isModalInitialized = true;

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest(".write-review-btn");
    if (openBtn) {
      event.preventDefault();
      openReviewModal();
    }
  });

  const closeBtn = document.getElementById("close-review-modal-btn");
  const cancelBtn = document.getElementById("cancel-review-btn");
  const form = document.getElementById("review-modal-form");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeReviewModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeReviewModal);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeReviewModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeReviewModal();
    }
  });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!selectedRating) {
        return;
      }

      if (hasUserReviewed && currentUserReviewId) {
        await changeReview(currentUserReviewId, selectedRating);
      } else {
        await addReview(currentProductId, selectedRating);
      }
      closeReviewModal();

      const updatedReviews = await fetchProductReviews(currentProductId);
      if (updatedReviews) {
        await renderReviews(currentProductId, updatedReviews);
      }
    });
  }

  initStarRating();
}

function openReviewModal() {
  const modal = document.getElementById("review-modal");
  if (!modal) {
    return;
  }

  const modalTitle = document.getElementById("review-modal-title");
  if (modalTitle) {
    modalTitle.textContent = hasUserReviewed
      ? "Edit Your Review"
      : "Write a Review";
  }

  const submitBtn = document.getElementById("submit-review-btn");
  if (submitBtn) {
    submitBtn.textContent = hasUserReviewed
      ? "Update Review"
      : "Submit Review";
  }

  if (hasUserReviewed && currentUserRating) {
    selectedRating = currentUserRating;
  } else {
    selectedRating = 0;
  }

  updateStarsDisplay(selectedRating);
  updateSubmitButtonState(selectedRating);
  updateRatingText(selectedRating);

  modal.hidden = false;
  document.body.classList.add("modal-open");

  const closeBtn = document.getElementById("close-review-modal-btn");
  if (closeBtn) {
    closeBtn.focus();
  }
}

function closeReviewModal() {
  const modal = document.getElementById("review-modal");
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");

  selectedRating = 0;
  updateStarsDisplay(0);
  updateSubmitButtonState(0);
  updateRatingText(0);
}

function initStarRating() {
  const starButtons = document.querySelectorAll(".rating-star-btn");
  const starsContainer = document.querySelector(".review-rating-stars");

  if (!starButtons.length || !starsContainer) {
    return;
  }

  starButtons.forEach((btn) => {
    const ratingValue = Number(btn.dataset.rating);

    btn.addEventListener("mouseenter", () => {
      updateStarsDisplay(ratingValue);
      updateRatingText(ratingValue);
    });

    btn.addEventListener("click", () => {
      selectedRating = ratingValue;
      updateStarsDisplay(selectedRating);
      updateSubmitButtonState(selectedRating);
      updateRatingText(selectedRating);
    });
  });

  starsContainer.addEventListener("mouseleave", () => {
    updateStarsDisplay(selectedRating);
    updateRatingText(selectedRating);
  });
}

function updateStarsDisplay(rating) {
  const starButtons = document.querySelectorAll(".rating-star-btn");
  starButtons.forEach((btn) => {
    const starRating = Number(btn.dataset.rating);
    const starSvg = btn.querySelector("svg");

    if (starSvg) {
      if (starRating <= rating) {
        starSvg.classList.add("filled");
      } else {
        starSvg.classList.remove("filled");
      }
    }

    btn.setAttribute(
      "aria-checked",
      starRating === selectedRating ? "true" : "false",
    );
  });
}

function updateSubmitButtonState(rating) {
  const submitBtn = document.getElementById("submit-review-btn");
  if (submitBtn) {
    submitBtn.disabled = rating === 0;
  }
}

function updateRatingText(rating) {
  const feedbackEl = document.querySelector(".rating-feedback-text");
  if (!feedbackEl) {
    return;
  }

  if (rating > 0) {
    feedbackEl.textContent = `${rating} of 5 stars`;
  } else {
    feedbackEl.textContent = "";
  }
}

//helper functions

function calculateRatingCount(ratingItems) {
  const ratingCount = {
    oneStarRatings: 0,
    twoStarRatings: 0,
    threeStarRatings: 0,
    fourStarRatings: 0,
    fiveStarRatings: 0,
  };
  if (ratingItems) {
    ratingItems.forEach((item) => {
      const matchingRatingData = Object.keys(ratingCount)[item.rating - 1];
      ratingCount[matchingRatingData]++;
    });
  }
  return ratingCount;
}

function calculateAverageRating(ratingsItems, totalRatingCount) {
  let sum = 0;
  if (!ratingsItems || !totalRatingCount) {
    console.error(
      "please provide ratingItems and totalRatingCount to calculateAverageRating function",
    );
    return;
  }
  ratingsItems.forEach((item) => {
    sum += item.rating;
  });

  return (sum / totalRatingCount).toFixed(1);
}

function calculateRatingCountPercentage(ratingCount, totalCount) {
  if (!ratingCount || !totalCount) {
    return 0;
  }

  const reviewRatingNumerator = totalCount + ratingCount - totalCount;
  return ((reviewRatingNumerator / totalCount) * 100).toFixed(0);
}

initReviewModal();
