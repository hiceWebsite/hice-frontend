/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { TBuyer } from "@/types/buyer";
import { TMeta } from "@/types";

export const buyerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //Create Buyer
    createBuyer: build.mutation({
      query: (data) => ({
        url: "/users/create-buyer",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.buyer],
    }),
    // Get all Buyers
    getAllBuyers: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/buyers",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: TBuyer[], meta: TMeta) => {
        return {
          buyers: response,
          meta,
        };
      },
      providesTags: [tagTypes.buyer],
    }),

    // Get single Buyer
    getBuyer: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/buyers/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.buyer],
    }),

    // Update Buyer
    updateBuyer: build.mutation({
      query: (data) => {
        return {
          url: `/buyers/${data.id}`,
          method: "PATCH",
          data: data.body,
        };
      },
      invalidatesTags: [tagTypes.buyer],
    }),

    // Delete Buyer
    deleteBuyer: build.mutation({
      query: (id) => ({
        url: `/buyers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.buyer],
    }),
  }),
});

export const {
  useCreateBuyerMutation,
  useGetAllBuyersQuery,
  useGetBuyerQuery,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,
} = buyerApi;
