import { DogInfoObj } from "../../shared/types/CardObj";
import { baseApi } from "./baseApi";

const path = "dogs";

export const dogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    breeds: builder.query<string[], void>({
      query: () => ({
        method: "GET",
        url: `${path}/breeds`,
      }),
    }),

    searchDogs: builder.query<
      { resultIds: string[]; total: number; next?: string; prev?: string },
      {
        breeds?: string[];
        zipCodes?: string[];
        ageMin?: number;
        ageMax?: number;
        size?: number;
        from?: string;
        sort?: string;
      }
    >({
      query: ({ breeds, zipCodes, ageMin, ageMax, size = 25, from, sort }) => ({
        method: "GET",
        url: `${path}/search`,
        params: {
          breeds,
          zipCodes,
          ageMin,
          ageMax,
          size,
          from,
          sort,
        },
      }),
    }),

    fetchDogs: builder.mutation<DogInfoObj[], string[]>({
      query: (body) => ({
        method: "POST",
        url: `${path}`,
        body,
      }),
    }),

    matchDog: builder.mutation<{ match: string }, string[]>({
      query: (body) => ({
        method: "POST",
        url: `${path}/match`,
        body,
      }),
    }),
  }),
});

export const {
  useBreedsQuery,
  useSearchDogsQuery,
  useFetchDogsMutation,
  useMatchDogMutation,
} = dogApi;
