export let filterState = {
  search: "",
  brand: "",
  inStock: null,
  sortBy: "",
  sortDescending: false,
  categoryId: "",
  minRating: null,
  minPrice: null,
  maxPrice: null,
  take: 8,
  page: 1,
};

export const PARAM_MAP = {
  search: "Search",
  brand: "Brand",
  inStock: "InStock",
  sortBy: "SortBy",
  sortDescending: "SortDescending",
  categoryId: "CategoryId",
  minRating: "MinRating",
  minPrice: "MinPrice",
  maxPrice: "MaxPrice",
  take: "Take",
  page: "Page",
};

export const initialFilterState = {
  search: "",
  brand: "",
  inStock: null,
  sortBy: "",
  sortDescending: false,
  categoryId: "",
  minRating: null,
  minPrice: null,
  maxPrice: null,
  take: 8,
  page: 1,
};
