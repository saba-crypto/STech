import { showPopup } from "./showPopup.js";

//displays backend response errors, used for api calls in /data folder
export function displayErrorPopups(errors) {
  if (!errors || errors.length <= 0) {
    return;
  }
  for (const [key] of Object.entries(errors)) {
    errors[key].forEach((errorMessage) => {
      if (errorMessage) {
        showPopup(errorMessage);
      }
    });
  }
}
