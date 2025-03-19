import { baseApi } from "./baseApi";

const path = "locations";

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

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], string[]>({
      query: (zipCodes) => ({
        url: `${path}`,
        method: "POST",
        body: zipCodes,
      }),
    }),

    searchLocations: builder.mutation<
      { results: Location[]; total: number },
      {
        city?: string;
        states?: string[];
        geoBoundingBox?: GeoBoundingBox;
        size?: number;
        from?: number;
      }
    >({
      query: ({ city, states, geoBoundingBox, size = 25, from }) => ({
        url: `${path}/search`,
        method: "POST",
        body: {
          city,
          states,
          geoBoundingBox,
          size,
          from,
        },
      }),
    }),
  }),
});

export const { useGetLocationsQuery, useSearchLocationsMutation } =
  locationsApi;
