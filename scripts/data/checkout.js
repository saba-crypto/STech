import { showPopup, showSuccessPopup } from "../utils/showPopup.js";
import { API_KEY } from "./secret.js";

export async function checkout() {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }
    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/users/checkout`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      const result = await response.json();
      showPopup(result.detail || "Checkout Unsuccessful");
      throw new Error(
        `Unexpected error occurred while trying to do checkout, error message: ${result.detail}`,
      );
    }
    const result = await response.json();
    showSuccessPopup(result.message);
  } catch (err) {
    console.error(err.message);
  }
}
