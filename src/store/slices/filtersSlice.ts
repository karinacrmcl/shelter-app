import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

const DEFAULT_RADIUS = 50;
const DEFAULT_AGE_RANGE: number[] = [0, 30];
const DEFAULT_SORT = "name-a-z";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoBoundingBox {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  bottom_left?: Coordinates;
  top_left?: Coordinates;
  bottom_right?: Coordinates;
  top_right?: Coordinates;
}

export interface LocationData {
  zipCode: string;
  city?: string;
  state?: string;
  coordinates?: Coordinates;
}

export interface FiltersState {
  selectedBreeds: string[];
  radius: number;
  ageRange: number[];
  sortBy: "name-a-z" | "name-z-a" | "age-asc" | "age-desc";
  location: LocationData | null;
  from: number | null;
}

const initialState: FiltersState = {
  selectedBreeds: [],
  radius: DEFAULT_RADIUS,
  ageRange: DEFAULT_AGE_RANGE,
  sortBy: DEFAULT_SORT,
  location: null,
  from: null,
};

export const fetchLocations = createAsyncThunk(
  "filters/fetchLocations",
  async (zipCodes: string[]) => {
    const response = await fetch("/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zipCodes),
    });
    return response.json();
  }
);

export const searchLocations = createAsyncThunk(
  "filters/searchLocations",
  async ({
    city,
    states,
    geoBoundingBox,
    size = 25,
    from,
  }: {
    city?: string;
    states?: string[];
    geoBoundingBox?: GeoBoundingBox;
    size?: number;
    from?: number;
  }) => {
    const response = await fetch("/locations/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, states, geoBoundingBox, size, from }),
    });
    return response.json();
  }
);

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
    setLocation: (state, action: PayloadAction<LocationData | null>) => {
      state.location = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.location = action.payload[0]; // Set first result
        }
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        if (action.payload.results.length > 0) {
          state.location = action.payload.results[0]; // Set first search result
        }
      });
  },
});

export const {
  setBreeds,
  setRadius,
  setAgeRange,
  setSortBy,
  setLocation,
  setFrom,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
