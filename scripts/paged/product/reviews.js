import { fetchProductReviews } from "../../data/reviews.js";
import { renderStars } from "../../utils/renderRatingStars.js";
export async function renderReviews(productId) {
  if (!productId) {
    console.error("productId was not provided for rendering reviews");
    return;
  }
  const result = await fetchProductReviews(productId);
  renderReviewsList(result.items);

  renderRatingSummary(result);
}

function renderReviewsList(reviewItems) {
  const reviewsList = document.querySelector(".reviews-list");
  if (!reviewsList) {
    return;
  }

  reviewsList.innerHTML = reviewItems
    .map((review) => {
      const formattedDate = new Date(review.createdAt).toLocaleDateString();
      return `
    
    <article class="review-item">
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
        </div>
      </header>
    </article>
    `;
    })
    .join("");
}

function renderRatingSummary(ratingInfo) {
  const ratingSummary = document.querySelector(".rating-summary");
  const averageRating = calculateAverageRating(
    ratingInfo.items,
    ratingInfo.totalCount,
  );
  const reviewRatingCountData = calculateRatingCount(ratingInfo.items);
  const reviewRatingNumerator =
    ratingInfo.totalCount +
    reviewRatingCountData.fiveStarRatings -
    ratingInfo.totalCount;
  const temp = (reviewRatingNumerator / ratingInfo.totalCount) * 100;
  console.log(
    calculateRatingCountPercentage(
      reviewRatingCountData.fiveStarRatings,
      ratingInfo.totalCount,
    ),
  );
  ratingSummary.innerHTML = `
    <div class="summary-left">
      <div class="average-rating">${averageRating}</div>
      <div class="rating-stars" aria-label="Average rating: ${averageRating} out of 5 stars">
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
