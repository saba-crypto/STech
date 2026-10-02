import { register } from "../../data/authentication.js";

const form = document.querySelector(".register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userDetails = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await register(userDetails);
  if (!result) {
    return;
  }
  window.location.href = `./verification.html?email=${userDetails.email}`;
});
