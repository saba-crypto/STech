const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".site-header__menu");

if (header && menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.dataset.menuOpen === "true";

    header.dataset.menuOpen = String(!isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  });
}
