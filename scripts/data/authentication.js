import { showSuccessPopup } from "../utils/showPopup.js";
import { API_KEY } from "./secrets.js";
import { apiRequest } from "./apiClient.js";

export async function login(email, password) {
  if (!email || !password) {
    throw new Error(
      "Error Occurred while trying to login, email or/and password provided for login function are invalid"
    );
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password }
  });

  showSuccessPopup("Login Successful!");
  localStorage.setItem("accessToken", result.data.accessToken);
  localStorage.setItem("refreshToken", result.data.refreshToken);

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 700);

  return result;
}

export async function register(userDetails) {
  try {
    if (!userDetails || Object.keys(userDetails).length !== 4) {
      throw new Error("user details provided for register are not valid.");
    }

    return await apiRequest("/auth/register", {
      method: "POST",
      body: userDetails
    });
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function verifyEmail(verificationData) {
  try {
    if (!verificationData || Object.keys(verificationData).length !== 2) {
      throw new Error("user details provided for verifyEmail are not valid.");
    }

    return await apiRequest("/auth/verify-email", {
      method: "PUT",
      body: verificationData
    });
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function resendEmailVerification(email) {
  try {
    if (!email) {
      throw new Error(
        "Unexpected Error occurred while trying to resend email verification code, make sure that email was provided for resendEmailVerification function."
      );
    }

    return await apiRequest(`/auth/resend-email-verification/${email}`, {
      method: "POST"
    });
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function forgetPassword(email) {
  try {
    if (!email) {
      throw new Error(
        "Unexpected Error occurred while trying to send a password reset link, provided email for forgetPassword function is not found."
      );
    }

    return await apiRequest(`/auth/forget-password/${email}`, {
      method: "POST"
    });
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function refreshAccessToken(token) {
  try {
    if (!token) {
      throw new Error(
        "refresh token was not provided for refreshAccessToken function"
      );
    }
    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/auth/refresh-access-token/${token}`,
      {
        headers: {
          "X-API-KEY": API_KEY
        }
      }
    );
    const result = await response.json();
    if (!response.ok) {
      if (!result.errors || Object.keys(result.errors).length <= 0) {
        throw new Error(
          result.detail || "Verification Failed, Please try Again Later."
        );
      } else {
        throw new Error(JSON.stringify(result.errors));
      }
    }
    return result.data;
  } catch (err) {
    console.error(err.message || err);
    return null;
  }
}
