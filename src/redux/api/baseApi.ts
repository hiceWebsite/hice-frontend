// import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
// import { createApi } from "@reduxjs/toolkit/query/react";
// import { tagTypesList } from "../tag-types";

// // Define a service using a base URL and expected endpoints
// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: axiosBaseQuery({ baseUrl: "https://3dmodels.hice.com.au/api/v1" }),
//   // baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:5000/api/v1" }),
//   endpoints: () => ({}),
//   tagTypes: tagTypesList,
// });

import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tag-types";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    // baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
    // baseUrl: "https://3dmodels.hice.com.au/api/v1"
    baseUrl: "http://localhost:5000/api/v1",
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
