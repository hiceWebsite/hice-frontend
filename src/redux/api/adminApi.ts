import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //Create Admin
    createAdmin: build.mutation({
      query: (data) => ({
        url: "/user/create-admin",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const { useCreateAdminMutation } = adminApi;
