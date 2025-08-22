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
import { useCreateBuyerMutation } from "@/redux/api/buyerApi";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const buyerValidationSchema = z.object({
  password: z.string().min(5, "Password must be at least 5 characters"),
  email: z.email("Invalid email").min(1, "Email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().optional(),
});

const modifyPayload = (values: any) => {
  const data = JSON.stringify(values);
  const formData = new FormData();
  formData.append("data", data);
  return formData;
};

const CreateBuyer = ({ open, setOpen }: TProps) => {
  const [createBuyer] = useCreateBuyerMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    try {
      setLoading(true);
      const payload = modifyPayload({
        password: values.password,
        buyer: {
          email: values.email,
          name: { firstName: values.firstName, lastName: values.lastName },
          address: values.address,
        },
      });

      const res = await createBuyer(payload).unwrap();
      if (res) {
        toast.success(res.message || "Buyer created successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        "Failed to create buyer.";
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
    address: "",
  };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title="Create New Buyer"
      sx={{ zIndex: 1300 }}
    >
      <PHForm
        onSubmit={handleFormSubmit}
        resolver={zodResolver(buyerValidationSchema)}
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
          <PHInput name="address" label="Address" fullWidth />
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
            Creating buyer, please wait...
          </Typography>
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default CreateBuyer;
