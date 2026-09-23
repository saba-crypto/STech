//mainly used for rendering individual product card HTML rating stars
export function renderStars(starCount) {
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
