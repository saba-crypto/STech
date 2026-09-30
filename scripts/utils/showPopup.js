export function showPopup(message, type = "error") {
  let container = document.querySelector(".popup-container");
  if (!container) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="popup-container"></div>`,
    );
    container = document.querySelector(".popup-container");
  }

  const isSuccess = type === "success";
  const popupClass = isSuccess ? "success-popup" : "error-popup";
  const role = isSuccess ? "status" : "alert";

  const iconSvg = isSuccess
    ? `
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `
    : `
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;

  const popupHtml = `
    <div class="${popupClass}" role="${role}">
      <div class="popup-content">
        ${iconSvg}
        <span>${message}</span>
      </div>
      <button type="button" class="popup-close" aria-label="Close notification">&times;</button>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", popupHtml);
  const popup = container.lastElementChild;

  const dismiss = () => {
    popup.classList.add("fade-out");
    setTimeout(() => {
      popup.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  };

  const timer = setTimeout(dismiss, 5000);

  popup.querySelector(".popup-close").addEventListener("click", () => {
    clearTimeout(timer);
    dismiss();
  });
}

export function showSuccessPopup(message) {
  showPopup(message, "success");
}
