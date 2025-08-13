/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FieldValues } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHFullScreenModal from "@/components/Shared/PHModal/PHFullScreenModal";
import { useCreateDisclaimerMutation } from "@/redux/api/disclaimerApi";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Zod validation schema
const disclaimerValidationSchema = z.object({
  disDescription: z.string().min(1, "Description is required"),
});

const CreateDisclaimer = ({ open, setOpen }: TProps) => {
  const [createDisclaimer] = useCreateDisclaimerMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    const { disDescription } = values;

    if (!disDescription) {
      toast.error("Description is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await createDisclaimer({ body: { disDescription } }).unwrap();
      if (res?._id) {
        toast.success("Disclaimer created successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      console.error("Create disclaimer failed:", err);
      toast.error(err?.message || "Failed to create disclaimer.");
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = {
    disDescription: "",
  };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title="Create New Disclaimer"
      sx={{ zIndex: 1300 }}
    >
      <PHForm
        onSubmit={handleFormSubmit}
        resolver={zodResolver(disclaimerValidationSchema)}
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
          <PHInput
            name="disDescription"
            label="Description"
            fullWidth
            required
          />
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
            Creating disclaimer, please wait...
          </Typography>
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default CreateDisclaimer;
