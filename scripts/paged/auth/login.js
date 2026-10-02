import { login } from "../../data/authentication.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const email = formData.get("email");
  const password = formData.get("password");

  await login(email, password);
  // const response = await fetch(
  //   "https://shopapi.stepacademy.ge/api/auth/login",
  //   {
  //     method: "POST",
  //     headers: {
  //       "X-API-KEY": API_KEY,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(user),
  //   },
  // );
  // const result = await response.json();
  // if (
  //   response.status < 200 ||
  //   response.status > 299 ||
  //   (result.status && (result.status < 200 || result.status > 299))
  // ) {
  //   if (result.errors && Object.keys(result.errors).length > 0) {
  //     Object.values(result.errors).forEach((errors) => {
  //       if (Array.isArray(errors)) {
  //         errors.forEach((errorMessage) => showPopup(errorMessage));
  //       } else if (typeof errors === "string") {
  //         showPopup(errors);
  //       }
  //     });
  //   } else if (result.detail) {
  //     showPopup(result.detail);
  //   } else if (result.message) {
  //     showPopup(result.message);
  //   } else {
  //     showPopup("Registration failed. Please try again.");
  //   }
  // } else {
  //   localStorage.setItem("accessToken", result.data.accessToken);
  //   localStorage.setItem("refreshToken", result.data.refreshToken);
  //   window.location.href = "../index.html";
  // }
});
