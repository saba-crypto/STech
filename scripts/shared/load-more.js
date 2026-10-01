export function updateLoadMoreButton(
  containerOrOptions,
  hasMore,
  onLoadMore,
  insertBefore = null,
) {
  let container;
  let hasMoreVal;
  let onLoadMoreFn;
  let insertBeforeEl;

  if (
    containerOrOptions &&
    typeof containerOrOptions === "object" &&
    !("nodeType" in containerOrOptions)
  ) {
    container = containerOrOptions.container;
    hasMoreVal = containerOrOptions.hasMore;
    onLoadMoreFn = containerOrOptions.onLoadMore;
    insertBeforeEl = containerOrOptions.insertBefore || null;
  } else {
    container = containerOrOptions;
    hasMoreVal = hasMore;
    onLoadMoreFn = onLoadMore;
    insertBeforeEl = insertBefore;
  }

  if (!container) return;

  let loadMoreSection = container.querySelector(".load-more-section");

  if (hasMoreVal) {
    if (!loadMoreSection) {
      loadMoreSection = document.createElement("div");
      loadMoreSection.className = "load-more-section";
      loadMoreSection.innerHTML = `
        <button type="button" class="load-more-btn">Load More</button>
      `;

      if (insertBeforeEl && container.contains(insertBeforeEl)) {
        container.insertBefore(loadMoreSection, insertBeforeEl);
      } else {
        container.appendChild(loadMoreSection);
      }

      const loadMoreBtn = loadMoreSection.querySelector(".load-more-btn");
      loadMoreBtn.addEventListener("click", async () => {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = "Loading...";

        try {
          if (typeof onLoadMoreFn === "function") {
            await onLoadMoreFn();
          }
        } catch (error) {
          console.error("Error loading more items:", error);
        } finally {
          if (document.body.contains(loadMoreBtn)) {
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = "Load More";
          }
        }
      });
    }
  } else if (loadMoreSection) {
    loadMoreSection.remove();
  }
}
