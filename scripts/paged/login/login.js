import { API_KEY } from "../../data/secret.js";
const form = document.querySelector(".login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const response = await fetch(
    "https://shopapi.stepacademy.ge/api/auth/login",
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
  console.log(result);
});
