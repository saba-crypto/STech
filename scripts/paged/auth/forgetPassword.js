import { forgetPassword } from "../../data/authentication.js";
import { showSuccessPopup } from "../../utils/showPopup.js";
import "../../shared/chatbot.js";

const form = document.querySelector(".forgot-password-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const email = formData.get("email");

  if (!email) {
    console.error("email was not found");
    return;
  }
  const result = await forgetPassword(email);
  if (!result) {
    return;
  }
  showSuccessPopup("Reset link was sent! Check your Email");
});
