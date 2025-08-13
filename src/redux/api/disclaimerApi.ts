/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { TMeta } from "@/types/common";
import { TDisclaimer } from "@/types/disclaimer";

export const disclaimerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //Create Disclaimers
    createDisclaimer: build.mutation({
      query: (data) => ({
        url: "/disclaimers/create-disclaimer",
        method: "POST",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.disclaimer],
    }),

    //get all Disclaimers
    getAllDisclaimers: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/disclaimers",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: TDisclaimer[], meta: TMeta) => {
        return {
          disclaimers: response,
          meta,
        };
      },
      providesTags: [tagTypes.disclaimer],
    }),

    //get single Disclaimer
    getDisclaimer: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/disclaimers/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.disclaimer],
    }),

    //update Disclaimer
    updateDisclaimer: build.mutation({
      query: (data) => {
        return {
          url: `/disclaimers/${data.id}`,
          method: "PATCH",
          data: data.body,
        };
      },
      invalidatesTags: [tagTypes.disclaimer],
    }),

    //delete Disclaimer
    deleteDisclaimer: build.mutation({
      query: (id) => ({
        url: `/disclaimers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.disclaimer],
    }),
  }),
});

export const {
  useGetAllDisclaimersQuery,
  useGetDisclaimerQuery,
  useCreateDisclaimerMutation,
  useUpdateDisclaimerMutation,
  useDeleteDisclaimerMutation,
} = disclaimerApi;
