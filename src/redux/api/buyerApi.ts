import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const buyerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //Create Buyer
    createBuyer: build.mutation({
      query: (data) => ({
        url: "/user/create-buyer",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.buyer],
    }),
  }),
});

export const { useCreateBuyerMutation } = buyerApi;
