import { displayErrorPopups } from "../utils/displayErrors.js";
import { showPopup } from "../utils/showPopup.js";
import { API_KEY } from "./secret.js";

export async function fetchUser() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/users/me",
      {
        method: "GET",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function updateUserPassword(currentPassword, newPassword) {
  try {
    if (!currentPassword || !newPassword) {
      throw new Error(
        "Couldn't change user password, currentPassword or/and newPassword is undefined in updateUserPassword function",
      );
    }
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return null;
    }
    const userResponse = await fetchUser();
    if (!userResponse) {
      return null;
    }

    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/users/change-password",
      {
        method: "PUT",
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(result.detail);
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to change user password, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    return result;
  } catch (err) {
    console.error(err.message);
  }
}
