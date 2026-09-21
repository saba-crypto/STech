import { API_KEY } from "./secret.js";

export async function fetchCategories() {
  const response = await fetch(
    "https://shopapi.stepacademy.ge/api/categories",
    {
      headers: {
        "X-API-KEY": API_KEY,
      },
    },
  );
  const result = await response.json();
  return result.data;
}
