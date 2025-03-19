import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_RADIUS = 50;
const DEFAULT_AGE_RANGE: number[] = [0, 30];
const DEFAULT_SORT = "name-a-z";

export interface FiltersState {
  selectedBreeds: string[];
  radius: number;
  ageRange: number[];
  sortBy: "name-a-z" | "name-z-a" | "age-asc" | "age-desc";
  zipCode: string | null;
  from: number | null;
}

const initialState: FiltersState = {
  selectedBreeds: [],
  radius: DEFAULT_RADIUS,
  ageRange: DEFAULT_AGE_RANGE,
  sortBy: DEFAULT_SORT,
  zipCode: null,
  from: null,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setBreeds: (state, action: PayloadAction<string[]>) => {
      state.selectedBreeds = action.payload;
    },
    setRadius: (state, action: PayloadAction<number>) => {
      state.radius = action.payload;
    },
    setAgeRange: (state, action: PayloadAction<number[]>) => {
      state.ageRange = action.payload;
    },
    setFrom: (state, action: PayloadAction<number>) => {
      state.from = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"name-a-z" | "name-z-a" | "age-asc" | "age-desc">
    ) => {
      state.sortBy = action.payload;
    },
    setZipCode: (state, action: PayloadAction<string | null>) => {
      state.zipCode = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setBreeds,
  setRadius,
  setAgeRange,
  setSortBy,
  setZipCode,
  setFrom,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
