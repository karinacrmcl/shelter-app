import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authSlice from "./slices/authSlice";
import favouritesSlice from "./slices/favouritesSlice";
import filtersSlice from "./slices/filtersSlice";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authSlice,
  filters: filtersSlice,
  favourites: favouritesSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
