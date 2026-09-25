import { API_KEY } from "./secret.js";

//fetches all categories and returns them based on categoryCount parameter.
export async function fetchCategories(count) {
  const response = await fetch(
    "https://shopapi.stepacademy.ge/api/categories",
    {
      headers: {
        "X-API-KEY": API_KEY,
      },
    },
  );
  const result = await response.json();
  if (!count) {
    return result.data;
  } else {
    return result.data.splice(0, count);
  }
}
