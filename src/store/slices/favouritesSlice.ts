import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DogInfoObj } from "../../shared/types/CardObj";
import { dogApi } from "../api/dogApi";

export interface FavouritesState {
  favouriteDogIds: string[];
  favouriteDogs: DogInfoObj[];
}

const initialState: FavouritesState = {
  favouriteDogIds: [],
  favouriteDogs: [],
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<string>) => {
      if (!state.favouriteDogIds.includes(action.payload)) {
        state.favouriteDogIds.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.favouriteDogIds = state.favouriteDogIds.filter(
        (id) => id !== action.payload
      );
    },
    toggleFavourite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favouriteDogIds.includes(id)) {
        state.favouriteDogIds = state.favouriteDogIds.filter(
          (fav) => fav !== id
        );
      } else {
        state.favouriteDogIds.push(id);
      }
    },
    resetFavourites: (state) => {
      state.favouriteDogIds = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      dogApi.endpoints.fetchDogs.matchFulfilled,
      (state, action: PayloadAction<DogInfoObj[]>) => {
        state.favouriteDogs = action.payload;
      }
    );
  },
});

export const {
  addFavourite,
  removeFavourite,
  toggleFavourite,
  resetFavourites,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
