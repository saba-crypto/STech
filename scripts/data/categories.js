import { apiRequest } from "./apiClient.js";

// Fetches all categories and returns them based on categoryCount parameter.
export async function fetchCategories(count) {
  try {
    const result = await apiRequest("/categories");
    if (!result || !result.data) {
      return [];
    }
    return count ? result.data.slice(0, count) : result.data;
  } catch (err) {
    console.error(err.message || err);
    return [];
  }
}
