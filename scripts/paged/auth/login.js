import { login } from "../../data/authentication.js";
import "../../shared/chatbot.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async event => {
  event.preventDefault();

  const formData = new FormData(form);

  const email = formData.get("email");
  const password = formData.get("password");
  const rememberBeState = formData.get("rememberMe");

  await login(email, password, rememberBeState);
});
