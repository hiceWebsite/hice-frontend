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
import { useCreateAdminMutation } from "@/redux/api/adminApi";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Zod validation schema
const adminValidationSchema = z.object({
  password: z.string().min(5, "Password must be at least 5 characters"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Modify payload to match backend expectations
const modifyPayload = (values: any) => {
  const data = JSON.stringify(values);
  const formData = new FormData();
  formData.append("data", data);
  return formData;
};

const CreateAdmin = ({ open, setOpen }: TProps) => {
  const [createAdmin] = useCreateAdminMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    try {
      setLoading(true);
      const payload = modifyPayload({
        password: values.password,
        admin: {
          email: values.email,
          name: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
        },
      });

      const res = await createAdmin(payload).unwrap();

      if (res) {
        // console.log("Create admin response:", res);
        toast.success(res.message || "Admin created successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      console.error("Create admin failed:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        "Failed to create admin.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = {
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title="Create New Admin"
      sx={{ zIndex: 1300 }}
    >
      <PHForm
        onSubmit={handleFormSubmit}
        resolver={zodResolver(adminValidationSchema)}
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
          <PHInput name="firstName" label="First Name" fullWidth required />
          <PHInput name="lastName" label="Last Name" fullWidth required />
          <PHInput name="email" label="Email" type="email" fullWidth required />
          <PHInput
            name="password"
            label="Password"
            type="password"
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
            Creating admin, please wait...
          </Typography>
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default CreateAdmin;
