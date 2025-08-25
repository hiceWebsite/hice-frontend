/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/actions/logoutUser";
import { useChangePasswordMutation } from "@/redux/api/userApi";
import { removeUser } from "@/services/auth.services";
import { useState } from "react";

const validationSchema = z.object({
  oldPassword: z.string("Old password is required"),
  newPassword: z.string("New password is required"),
});

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();

  // states for showing/hiding passwords
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  const onSubmit = async (values: FieldValues) => {
    try {
      const res = await changePassword({
        body: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
      }).unwrap();

      if (res?.email) {
        removeUser();
        logoutUser(router);
        toast.success(res?.message || "Password Changed Successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Incorrect Old Password. Please try again.";
      toast.error(errorMessage);
      console.error("Change password error:", error);
    }
  };

  return (
    <Box
      sx={{
        px: 4,
        py: 2,
        maxWidth: 600,
        width: "100%",
        boxShadow: 1,
        borderRadius: 1,
        mx: "auto",
        mt: { xs: 2, md: 5 },
      }}
    >
      <Stack alignItems="center" justifyContent="center">
        <Box
          sx={{
            "& svg": {
              width: 100,
              height: 100,
            },
          }}
        >
          <KeyIcon sx={{ color: "primary.main" }} />
        </Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2, mt: -1.5 }}>
          Change password
        </Typography>
      </Stack>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
        {/* Old Password */}
        <TextField
          label="Old Password"
          type={showOldPassword ? "text" : "password"}
          fullWidth
          {...register("oldPassword")}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message as string}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New Password */}
        <TextField
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          fullWidth
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message as string}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" sx={{ width: "100%", my: 2 }}>
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
