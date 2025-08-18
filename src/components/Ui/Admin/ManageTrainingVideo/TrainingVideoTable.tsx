/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "sonner";
import CreateTrainingVideo from "./CreateTrainingVideo";
import PHForm from "@/components/Forms/PHForm";
import {
  FormProvider,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteTrainingVideoMutation,
  useGetAllTrainingVideosQuery,
  useUpdateTrainingVideoMutation,
} from "@/redux/api/trainingApi";

export type TTrainingVideo = {
  _id: string;
  title: string;
  videoUrl: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

// Form values type
interface FormValues {
  title: string;
  videoUrl: string;
}

// Zod validation schema
const trainingVideoValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  videoUrl: z.string().min(1, "Video URL is required"),
});

const TrainingVideosTable = () => {
  const { data, isLoading } = useGetAllTrainingVideosQuery({});
  const [updateTrainingVideo] = useUpdateTrainingVideoMutation();
  const [deleteTrainingVideo] = useDeleteTrainingVideoMutation();
  const trainingVideos: TTrainingVideo[] = data?.trainingVideos || [];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateRow, setUpdateRow] = useState<TTrainingVideo | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Initialize useForm with resolver
  const methods = useForm<FormValues>({
    resolver: zodResolver(trainingVideoValidationSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
    },
  });

  // Reset form values when updateRow changes
  useEffect(() => {
    if (updateRow) {
      methods.reset({
        title: updateRow.title,
        videoUrl: updateRow.videoUrl,
      });
    } else {
      methods.reset({
        title: "",
        videoUrl: "",
      });
    }
  }, [updateRow, methods]);

  const handleAdd = () => {
    setOpenCreateDialog(true);
  };

  const handleDelete = async () => {
    console.log("Delete ID:", deleteId);

    if (deleteId !== null) {
      try {
        const response = await deleteTrainingVideo(deleteId).unwrap();
        toast.success(
          response.message || "Training video deleted successfully!"
        );
        setDeleteId(null);
      } catch (error: any) {
        console.error("Delete failed:", JSON.stringify(error, null, 2));
        const errorMessage =
          error?.data?.message ||
          error?.data?.errorSources?.[0]?.message ||
          "Failed to delete training video.";
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateOpen = (row: TTrainingVideo) => {
    setUpdateRow(row);
  };

  const handleUpdateClose = () => {
    setUpdateRow(null);
  };

  const handleUpdateSave: SubmitHandler<FormValues> = async (values) => {
    if (updateRow) {
      try {
        const response = await updateTrainingVideo({
          id: updateRow._id,
          body: { title: values.title, videoUrl: values.videoUrl },
        }).unwrap();
        toast.success(
          response.message || "Training video updated successfully!"
        );
        setUpdateRow(null);
      } catch (error: any) {
        console.error("Update failed:", JSON.stringify(error, null, 2));
        const errorMessage =
          error?.data?.message ||
          error?.data?.errorSources?.[0]?.message ||
          "Failed to update training video.";
        toast.error(errorMessage);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "videoUrl", headerName: "Video URL", flex: 1 },
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={() => handleUpdateOpen(params.row as TTrainingVideo)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setDeleteId(params.row._id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Button onClick={handleAdd} variant="contained" sx={{ mb: 2 }}>
        Create Training Video
      </Button>

      <CreateTrainingVideo
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
      />

      <DataGrid
        rows={trainingVideos}
        getRowId={(row) => row._id}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          "& .MuiDataGrid-cell": {
            border: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
      />

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this training video?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <button
            onClick={handleDelete}
            className="mui-btn mui-btn--contained-error"
          >
            DELETE
          </button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateRow !== null} onClose={handleUpdateClose}>
        <DialogTitle>Update Training Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the training video details below.
          </DialogContentText>
          <FormProvider {...methods}>
            <PHForm
              onSubmit={
                methods.handleSubmit(
                  handleUpdateSave
                ) as SubmitHandler<FieldValues>
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 2,
                }}
              >
                <TextField
                  {...methods.register("title")}
                  label="Title"
                  fullWidth
                  required
                  error={!!methods.formState.errors.title}
                  helperText={methods.formState.errors.title?.message}
                />
                <TextField
                  {...methods.register("videoUrl")}
                  label="Video URL"
                  fullWidth
                  required
                  error={!!methods.formState.errors.videoUrl}
                  helperText={methods.formState.errors.videoUrl?.message}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button onClick={handleUpdateClose}>Cancel</Button>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </Box>
              </Box>
            </PHForm>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TrainingVideosTable;
