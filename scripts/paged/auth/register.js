import { API_KEY } from "../../data/secret.js";
import { showPopup } from "../../utils/showPopup.js";

const form = document.querySelector(".register-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(form);

    const user = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(user);

    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/auth/register",
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      },
    );
    const result = await response.json();

    if (
      response.status < 200 ||
      response.status > 299 ||
      (result.status && (result.status < 200 || result.status > 299))
    ) {
      if (result.errors && Object.keys(result.errors).length > 0) {
        Object.values(result.errors).forEach((errors) => {
          if (Array.isArray(errors)) {
            errors.forEach((errorMessage) => showPopup(errorMessage));
          } else if (typeof errors === "string") {
            showPopup(errors);
          }
        });
      } else if (result.detail) {
        showPopup(result.detail);
      } else if (result.message) {
        showPopup(result.message);
      } else {
        showPopup("Registration failed. Please try again.");
      }
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
    showPopup("An unexpected error occurred. Please try again later.");
  }
});
