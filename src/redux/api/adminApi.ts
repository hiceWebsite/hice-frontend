/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { TMeta } from "@/types";
import { TAdmin } from "@/types/admin";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //Create Admin
    createAdmin: build.mutation({
      query: (data) => ({
        url: "/users/create-admin",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.admin],
    }),

    // Get all Admins
    getAllAdmins: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/admins",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: TAdmin[], meta: TMeta) => {
        return {
          admins: response,
          meta,
        };
      },
      providesTags: [tagTypes.admin],
    }),

    // Get single Admin
    getAdmin: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/admins/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.admin],
    }),

    // Update Admin
    updateAdmin: build.mutation({
      query: (data) => {
        return {
          url: `/admins/${data.id}`,
          method: "PATCH",
          data: data.body,
        };
      },
      invalidatesTags: [tagTypes.admin],
    }),

    // Delete Admin
    deleteAdmin: build.mutation({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useGetAdminQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
