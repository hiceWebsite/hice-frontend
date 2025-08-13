/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FieldValues } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHFullScreenModal from "@/components/Shared/PHModal/PHFullScreenModal";
import { useCreateAdminMutation } from "@/redux/api/adminApi";
import { useCreateBuyerMutation } from "@/redux/api/buyerApi";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { modifyPayload } from "@/utils/modifyPayload";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialRole: "admin" | "buyer";
};

// Zod validation schemas
const nameValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const adminValidationSchema = z.object({
  password: z.string().min(1, "Password is required"),
  admin: z.object({
    email: z.email("Invalid email address"),
    name: nameValidationSchema,
  }),
  file: z.any().optional(),
});

const buyerValidationSchema = z.object({
  password: z.string().min(1, "Password is required"),
  buyer: z.object({
    email: z.email("Invalid email address"),
    name: nameValidationSchema,
    address: z.string().min(1, "Address is required"),
  }),
  file: z.any().optional(),
});

const userValidationSchema = z.union([
  adminValidationSchema,
  buyerValidationSchema,
]);

const CreateUser = ({ open, setOpen, initialRole }: TProps) => {
  const [createAdmin] = useCreateAdminMutation();
  const [createBuyer] = useCreateBuyerMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    const formData = modifyPayload(values);

    try {
      setLoading(true);
      let res;
      if (initialRole === "admin") {
        res = await createAdmin(formData).unwrap();
      } else {
        res = await createBuyer(formData).unwrap();
      }

      if (res?._id) {
        toast.success(res.message || `User created successfully!`);
        setOpen(false);
      }
    } catch (err: any) {
      console.error("Create user failed:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        "Failed to create user.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const defaultValues =
    initialRole === "admin"
      ? {
          password: "",
          admin: { email: "", name: { firstName: "", lastName: "" } },
          file: null,
        }
      : {
          password: "",
          buyer: {
            email: "",
            name: { firstName: "", lastName: "" },
            address: "",
          },
          file: null,
        };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title={`Create New ${initialRole === "admin" ? "Admin" : "Buyer"}`}
      sx={{ zIndex: 1300 }}
    >
      <PHForm
        onSubmit={handleFormSubmit}
        resolver={zodResolver(userValidationSchema)}
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
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
          />
          {initialRole === "admin" ? (
            <>
              <PHInput name="admin.email" label="Email" fullWidth required />
              <PHInput
                name="admin.name.firstName"
                label="First Name"
                fullWidth
                required
              />
              <PHInput
                name="admin.name.lastName"
                label="Last Name"
                fullWidth
                required
              />
            </>
          ) : (
            <>
              <PHInput name="buyer.email" label="Email" fullWidth required />
              <PHInput
                name="buyer.name.firstName"
                label="First Name"
                fullWidth
                required
              />
              <PHInput
                name="buyer.name.lastName"
                label="Last Name"
                fullWidth
                required
              />
              <PHInput
                name="buyer.address"
                label="Address"
                fullWidth
                required
              />
            </>
          )}
          <PHInput name="file" label="Profile Image" type="file" fullWidth />
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
            Creating user, please wait...
          </Typography>
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default CreateUser;
