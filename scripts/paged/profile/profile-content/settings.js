import { updateUserPassword } from "../../../data/user.js";
import { showPopup, showSuccessPopup } from "../../../utils/showPopup.js";

export function renderSettings() {
  addEventListeners();
}

function addEventListeners() {
  const updatePasswordBtn = document.querySelector(".update-password-btn");
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmNewPasswordInput = document.getElementById("confirm-password");
  const deleteAccountButton = document.querySelector(".delete-account-btn");

  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener("click", async () => {
      const currentPassword = currentPasswordInput.value;
      const newPassword = newPasswordInput.value;
      const confirmNewPassword = confirmNewPasswordInput.value;
      if (!currentPassword) {
        showPopup("Please enter your current password");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        showPopup("Passwords do not match");
        return;
      }
      const response = await updateUserPassword(currentPassword, newPassword);
      if (!response) {
        return;
      }
      showSuccessPopup("Password was Changed Successfully!");

      //reset input values
      currentPassword = "";
      newPassword = "";
      confirmNewPassword = "";
    });
  }

  if (deleteAccountButton) {
    deleteAccountButton.addEventListener("click", () => {});
  }
}
