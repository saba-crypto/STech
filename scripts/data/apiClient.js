import { API_KEY } from "./secrets.js";
import { displayErrorPopups } from "../utils/displayErrors.js";
import { showPopup } from "../utils/showPopup.js";
import { refreshAccessToken } from "./authentication.js";

const BASE_URL = "https://shopapi.stepacademy.ge/api";

//this function is called "fetch wrapper"
export async function apiRequest(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  //helper function for building headers
  const buildHeaders = token => {
    const headers = {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchOptions = {
    method: options.method || "GET",
    headers: buildHeaders(accessToken)
  };

  if (fetchOptions.method !== "GET" && options.body) {
    fetchOptions.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  let response = await fetch(BASE_URL + endpoint, fetchOptions);

  //if status code is 401, we will try the same request but now we refresh access token(if it expired).
  if (response.status === 401 && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("colorTheme");
      showPopup("Session expired. Please log in again.");
      return null;
    }

    localStorage.setItem("accessToken", newAccessToken);
    fetchOptions.headers = buildHeaders(newAccessToken);

    response = await fetch(BASE_URL + endpoint, fetchOptions);
  }

  const result = await response.json();

  if (!response.ok) {
    handleErrors(result);
  }

  return result;
}

function handleErrors(result) {
  if (!result.errors || Object.keys(result.errors).length === 0) {
    showPopup(
      result.detail ||
        result.title ||
        "Something failed, please try again later."
    );
  } else {
    displayErrorPopups(result.errors);
  }

  throw new Error(result.detail || result.title || "Unexpected error occurred");
}
