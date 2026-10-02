import { showPopup, showSuccessPopup } from "../utils/showPopup.js";
import { API_KEY } from "./secret.js";

export async function login(email, password) {
  if (!email || !password) {
    throw new Error(
      "Error Occurred while trying to login, email or/and password provided for login function are invalid",
    );
  }
  const response = await fetch(
    "https://shopapi.stepacademy.ge/api/auth/login",
    {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    if (Object.keys(result.errors).length <= 0) {
      showPopup(
        result.detail || "Registration Failed, Please try Again Later.",
      );
    } else {
      displayErrorPopups(result.errors);
    }
    throw new Error(
      `Error occurred while trying to Login, error message: ${result.detail || result.title || "unknown error"}`,
    );
  }
  showSuccessPopup("Login Successful!");
  localStorage.setItem("accessToken", result.data.accessToken);
  localStorage.setItem("refreshToken", result.data.refreshToken);
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 700);
}

export async function register(userDetails) {
  try {
    if (!userDetails || Object.keys(userDetails).length !== 4) {
      throw new Error("user details provided for register are not valid.");
    }

    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/auth/register",
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Registration Failed, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to Login, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }

    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function verifyEmail(verificationData) {
  try {
    if (!verificationData || Object.keys(verificationData).length !== 2) {
      throw new Error("user details provided for verifyEmail are not valid.");
    }

    const response = await fetch(
      "https://shopapi.stepacademy.ge/api/auth/verify-email",
      {
        method: "PUT",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Verification Failed, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to Login, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    return result;
  } catch (err) {
    console.error(err.message);
  }
}

export async function resendEmailVerification(email) {
  try {
    if (!email) {
      throw new Error(
        "Unexpected Error occurred while trying to resend email verification code, make sure that email was provided for resendEmailVerification function.",
      );
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${email}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
        },
      },
    );
    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Verification Failed, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to resend email verification, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    return result;
  } catch (err) {
    console.error(err.message);
  }
}

export async function forgetPassword(email) {
  try {
    if (!email) {
      throw new Error(
        "Unexpected Error occurred while trying to to send a password reset link, provided email for forgetPassword function is not found.",
      );
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/auth/forget-password/${email}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
        },
      },
    );
    const result = await response.json();
    if (!response.ok) {
      if (Object.keys(result.errors).length <= 0) {
        showPopup(
          result.detail || "Verification Failed, Please try Again Later.",
        );
      } else {
        displayErrorPopups(result.errors);
      }
      throw new Error(
        `Error occurred while trying to resend email verification, error message: ${result.detail || result.title || "unknown error"}`,
      );
    }
    return result;
  } catch (err) {
    console.error(err.message);
  }
}

export async function resetPassword() {}
