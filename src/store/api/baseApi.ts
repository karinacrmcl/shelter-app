import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../http/baseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
