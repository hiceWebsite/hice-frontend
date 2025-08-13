/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { TMeta } from "@/types/common";
import { TTrainingVideo } from "@/types/trainingVideo";

export const disclaimerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //Create TrainingVideos
    createTrainingVideo: build.mutation({
      query: (data) => ({
        url: "/training-videos/create-training-video",
        method: "POST",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.trainingVideo],
    }),

    //get all Training Videos
    getAllTrainingVideos: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/training-videos",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: TTrainingVideo[], meta: TMeta) => {
        return {
          trainingVideos: response,
          meta,
        };
      },
      providesTags: [tagTypes.trainingVideo],
    }),

    //get single Training Video
    getTrainingVideo: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/training-videos/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.trainingVideo],
    }),

    //update TrainingVideo
    updateTrainingVideo: build.mutation({
      query: (data) => {
        return {
          url: `/training-videos/${data.id}`,
          method: "PATCH",
          data: data.body,
        };
      },
      invalidatesTags: [tagTypes.trainingVideo],
    }),

    //delete TrainingVideo
    deleteTrainingVideo: build.mutation({
      query: (id) => ({
        url: `/training-videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.trainingVideo],
    }),
  }),
});

export const {
  useGetAllTrainingVideosQuery,
  useGetTrainingVideoQuery,
  useCreateTrainingVideoMutation,
  useUpdateTrainingVideoMutation,
  useDeleteTrainingVideoMutation,
} = disclaimerApi;
