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
  }),
});

export const { useGetSingleUserQuery, useChangePasswordMutation } = userApi;
