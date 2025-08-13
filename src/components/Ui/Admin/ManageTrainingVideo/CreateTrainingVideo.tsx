/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FieldValues } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHFullScreenModal from "@/components/Shared/PHModal/PHFullScreenModal";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTrainingVideoMutation } from "@/redux/api/trainingApi";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Zod validation schema
const trainingVideoValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  videoUrl: z.string().min(1, "Video URL is required"),
});

const CreateTrainingVideo = ({ open, setOpen }: TProps) => {
  const [createTrainingVideo] = useCreateTrainingVideoMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    const { title, videoUrl } = values;

    try {
      setLoading(true);
      const res = await createTrainingVideo({
        body: { title, videoUrl },
      }).unwrap();
      if (res?._id) {
        toast.success(res.message || "Training video created successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      console.error(
        "Create training video failed:",
        JSON.stringify(err, null, 2)
      );
      const errorMessage =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        "Failed to create training video.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = {
    title: "",
    videoUrl: "",
  };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title="Create New Training Video"
      sx={{ zIndex: 1300 }}
    >
      <PHForm
        onSubmit={handleFormSubmit}
        resolver={zodResolver(trainingVideoValidationSchema)}
        defaultValues={defaultValues}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            my: 5,
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            px: 2,
          }}
        >
          <PHInput name="title" label="Title" fullWidth required />
          <PHInput name="videoUrl" label="Video URL" fullWidth required />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              disabled={loading}
            >
              Create
            </LoadingButton>
          </Box>
        </Box>
      </PHForm>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
          <Typography variant="body1" fontWeight={500}>
            Creating training video, please wait...
          </Typography>
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default CreateTrainingVideo;
