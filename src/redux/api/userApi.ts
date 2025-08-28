import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleUser: build.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    //Change Password
    changePassword: build.mutation({
      query: (data) => {
        console.log(data.body);
        return {
          url: `/auth/change-password`,
          method: "POST",
          data: data.body,
        };
      },
      invalidatesTags: [tagTypes.user],
    }),

    //Forgot Password
    forgotPassword: build.mutation({
      query: (data) => ({
        url: `/auth/forget-password`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetSingleUserQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
} = userApi;
