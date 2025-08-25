/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import Image from "next/image";
// import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { userLogin } from "@/services/actions/userLogin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storeUserInfo } from "@/services/auth.services";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import logoWhite from "@/assets/white-logo.png";
import Person2Icon from "@mui/icons-material/Person2";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const validationSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type LoginFormValues = z.infer<typeof validationSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPassword, setInitialPassword] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    setRememberMe(savedRememberMe);

    if (savedRememberMe) {
      setInitialEmail(localStorage.getItem("userEmail") || "");
      setInitialPassword(localStorage.getItem("userPassword") || "");
    }
  }, []);

  useEffect(() => {
    reset({ email: initialEmail, password: initialPassword });
  }, [initialEmail, initialPassword, reset]);

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setRememberMe(checked);

    localStorage.setItem("rememberMe", checked ? "true" : "false");
    if (!checked) {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPassword");
    }
  };

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const res = await userLogin(values);
      if (res?.data?.accessToken) {
        toast.success(res?.message);
        storeUserInfo({ accessToken: res?.data?.accessToken });

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("userEmail", values.email);
          localStorage.setItem("userPassword", values.password);
        } else {
          localStorage.setItem("rememberMe", "false");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userPassword");
        }

        router.push("/");
      } else {
        setError(res?.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100vw",
        height: "100vh",
        overflow: "auto",
      }}
    >
      {/* Left Section (Logo) */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          height: { xs: "auto", md: "100%" },
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, md: 0 },
        }}
      >
        <Image src={logoWhite} width={400} height={400} alt="logo" />
      </Box>

      {/* Right Section (Form) */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          height: { xs: "auto", md: "100%" },
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          py: { xs: 4, md: 0 },
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: { xs: "100%", sm: 400, xl: 600 },
          }}
          mb={5}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            color="secondary.main"
            mb={1}
            sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}
          >
            Sign In
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            color="secondary.main"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Sign in to view all the 3D models.
          </Typography>
          {error && (
            <Box>
              <Typography color="error" component="p" fontWeight={700}>
                {error}
              </Typography>
            </Box>
          )}
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%", maxWidth: { xs: "100%", sm: 400, xl: 600 } }}
        >
          {/* Email */}
          <TextField
            label="User Email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person2Icon />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Remember Me + Forgot */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMe}
                  color="primary"
                />
              }
              label="Remember Me"
            />
            <Typography
              textAlign="end"
              component="p"
              fontWeight={400}
              color="secondary.main"
              sx={{
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {/* <Link href="/login">Forgot Password?</Link> */}
            </Typography>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              margin: "10px 0px",
              height: "50px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#ffffff",
            }}
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
