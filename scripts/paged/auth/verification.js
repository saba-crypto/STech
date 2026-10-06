import {
  verifyEmail,
  resendEmailVerification,
} from "../../data/authentication.js";
import { showSuccessPopup } from "../../utils/showPopup.js";
import "../../shared/chatbot.js";

const form = document.querySelector(".verification-form");
const resendButton = document.querySelector(".resend-button");
const params = new URLSearchParams(window.location.search);
const verificationEmail = params.get("email");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const verificationData = {
    email: verificationEmail,
    code: formData.get("code"),
  };

  const result = await verifyEmail(verificationData);
  if (!result) {
    return;
  }
  showSuccessPopup("Registration was Successful!");
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 700);
});

resendButton.addEventListener("click", async () => {
  await resendEmailVerification(verificationEmail);
});
