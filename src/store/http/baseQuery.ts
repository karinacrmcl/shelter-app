import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: "https://frontend-take-home-service.fetch.com",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.append("Content-Type", "application/json");
    headers.append("accept", "application/json");
    return headers;
  },
  responseHandler: async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
});
