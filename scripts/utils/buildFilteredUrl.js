import { PARAM_MAP } from "../data/filterData.js";

const API_BASE_URL = "https://shopapi.stepacademy.ge/api/products/filter";

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
