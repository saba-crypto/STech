import { fetchUser } from "./user.js";
import { apiRequest } from "./apiClient.js";

function getLoginUrl() {
  const isPagesDir = window.location.pathname.includes("/pages/");
  return isPagesDir ? "./login.html" : "./pages/login.html";
}

async function ensureAuthenticated() {
  const accessToken = localStorage.getItem("accessToken");
  const user = await fetchUser();
  if (!accessToken || !user) {
    window.location.href = getLoginUrl();
    return false;
  }
  return true;
}

export async function fetchFavorites(take = 8, page = 1) {
  try {
    const isAuthed = await ensureAuthenticated();
    if (!isAuthed) return;

    const result = await apiRequest(`/favorites?Take=${take}&Page=${page}`);
    return result ? result.data : null;
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function addToFavorites(productId) {
  try {
    const isAuthed = await ensureAuthenticated();
    if (!isAuthed) return;

    if (!productId) {
      console.error(
        "productId was not provided for the request when trying to add to favorites",
      );
      return;
    }

    await apiRequest(`/favorites/${productId}`, {
      method: "POST",
    });
  } catch (err) {
    console.error(err.message || err);
  }
}

export async function removeFromFavorites(productId) {
  try {
    const isAuthed = await ensureAuthenticated();
    if (!isAuthed) return;

    if (!productId) {
      throw new Error(
        "productId is undefined, failed to remove favorite product",
      );
    }

    await apiRequest(`/favorites/${productId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(err.message || err);
  }
}
