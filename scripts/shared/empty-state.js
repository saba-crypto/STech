export const EMPTY_CART_ICON = `
  <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
`;

export const EMPTY_FAVORITES_ICON = `
  <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
`;

export function renderEmptyState(
  container,
  {
    iconSvg = "",
    title = "",
    description = "",
    buttonText = "Browse Products",
    buttonLink = "./shop.html",
    subtitleSelector = "",
    subtitleText = "",
  } = {},
) {
  if (subtitleSelector && subtitleText !== undefined) {
    const subtitle = document.querySelector(subtitleSelector);
    if (subtitle) {
      subtitle.textContent = subtitleText;
    }
  }

  if (!container) return;

  removeEmptyState(container);

  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.innerHTML = `
    <div class="empty-icon" aria-hidden="true">
      ${iconSvg}
    </div>
    <h2>${title}</h2>
    <p>${description}</p>
    <a href="${buttonLink}" class="browse-products-btn">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
      <span>${buttonText}</span>
    </a>
  `;

  container.appendChild(emptyState);
}

export function removeEmptyState(container) {
  if (!container) return;
  const emptyState = container.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
}
