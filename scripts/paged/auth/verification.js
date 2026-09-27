import { API_KEY } from "../../data/secret.js";
import { showPopup } from "../../utils/showPopup.js";
const form = document.querySelector(".verification-form");
const resetButton = document.querySelector(".resend-button");
const params = new URLSearchParams(window.location.search);
const verificationEmail = params.get("email");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(form);

    const data = {
      email: verificationEmail,
      code: formData.get("code"),
    };

    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/auth/verify-email",
      {
        method: "PUT",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
      window.location.href = "./login.html";
    }
  } catch (err) {
    console.error(err);
    showPopup("An unexpected error occurred. Please try again later.");
  }
});

resetButton.addEventListener("click", async () => {
  await resendEmailVerification(verificationEmail);
});

async function resendEmailVerification(email) {
  try {
    if (email) {
      const response = await fetch(
        `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${email}`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": API_KEY,
          },
        },
      );
      if (response.status !== 200) {
        const result = await response.json();
        throw new Error(`error occurred during verification, ${result.detail}`);
      }
    } else {
      throw new Error(
        "error occurred during email verification request, email was not provided",
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}
