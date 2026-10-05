import { showSuccessPopup } from "../utils/showPopup.js";
import { apiRequest } from "./apiClient.js";

// Used for fetching current user profile and session validation
export async function fetchUser() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken && !refreshToken) {
    return null;
  }

  try {
    const result = await apiRequest("/users/me");
    if (result && result.data) {
      sessionStorage.setItem("userId", result.data.id);
    }
    return result;
  } catch (error) {
    console.error("Failed to fetch user:", error.message || error);
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

    const result = await apiRequest("/users/change-password", {
      method: "PUT",
      body: {
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    });

    showSuccessPopup("Password was Changed Successfully!");
    return result;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function deleteUser() {
  try {
    const result = await apiRequest("/users/delete-profile", {
      method: "DELETE",
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    showSuccessPopup("Account was Deleted Successfully!");
    return result;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function checkout() {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = loginUrl;
      return;
    }

    const result = await apiRequest("/users/checkout", {
      method: "POST",
    });

    showSuccessPopup(result.message || "Checkout Successful");
    return result;
  } catch (err) {
    console.error(err.message || err);
  }
}
