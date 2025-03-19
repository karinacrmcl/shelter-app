import { RootState } from "../rootReducer";

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectFilters = (state: RootState) => state.filters;
export const selectFavourites = (state: RootState) => state.favourites;
