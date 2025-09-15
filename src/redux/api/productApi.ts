/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { TMeta } from "@/types/common";
import { TProduct } from "@/types/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //create Product
    createProduct: build.mutation({
      query: (data) => ({
        url: "/products/create-product",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    //get all Products
    getAllProducts: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/products",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: TProduct[], meta: TMeta) => {
        return {
          products: response,
          meta,
        };
      },
      providesTags: [tagTypes.product],
    }),

    //get single Product
    getProduct: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    // update Product
    updateProduct: build.mutation({
      query: ({ id, data }) => {
        // Log the ID and FormData contents
        console.log("Updating product with ID:", id);
        console.log("FormData contents:");
        for (const [key, value] of data.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: `/products/${id}`,
          method: "PATCH",
          contentType: "multipart/form-data",
          data,
        };
      },
      invalidatesTags: [tagTypes.product],
    }),

    //delete Product
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
