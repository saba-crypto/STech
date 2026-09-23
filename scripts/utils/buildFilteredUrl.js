import { PARAM_MAP } from "../data/filterData.js";

const API_BASE_URL = "https://shopapi.stepacademy.ge/api/products/filter";

//takes filtration data collected in client side and converts it to a search query for a backend(?inStock=true&Search="example") and returns it combined with base baseUrl
export function buildFilteredUrl(filters) {
  const params = new URLSearchParams();

  for (const [key, apiParam] of Object.entries(PARAM_MAP)) {
    const value = filters[key];

    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === false
    ) {
      continue;
    }

    params.append(apiParam, value);
  }

  const queryString = params.toString();
  return queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;
}
