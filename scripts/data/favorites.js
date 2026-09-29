import { API_KEY } from "./secret.js";
import { fetchUser } from "./user.js";

export async function fetchFavorites(take = 8, page = 1) {
  try {
    const isPagesDir = window.location.pathname.includes("/pages/");
    const loginUrl = isPagesDir ? "./login.html" : "./pages/login.html";
    const accessToken = localStorage.getItem("accessToken");

    const userResult = await fetchUser();
    if (!accessToken || !userResult) {
      window.location.href = loginUrl;
    }

    const response = await fetch(
      `https://shopapi.stepacademy.ge/api/favorites?Take=${take}&Page=${page}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`unable to fetch favorites.`);
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error(err.message);
  }
}
