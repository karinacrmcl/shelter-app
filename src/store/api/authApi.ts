import { baseApi } from "./baseApi";

const path = "auth";

type SignInDto = {
  name: string;
  email: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation<void, SignInDto>({
      query(body) {
        return {
          method: "POST",
          url: `${path}/login`,
          body,
        };
      },
    }),
    logout: builder.mutation<void, void>({
      query(body) {
        return {
          method: "POST",
          url: `${path}/logout`,
          body,
        };
      },
    }),
  }),
});

export const { useSigninMutation, useLogoutMutation } = authApi;
