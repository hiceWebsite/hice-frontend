"use client";

import CircleLoading from "@/components/CircleLoading/CircleLoading";
import Footer from "@/components/Shared/Footer/Footer";
import Navbar from "@/components/Shared/Navbar/Navbar";
import { isLoggedIn } from "@/services/auth.services";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = isLoggedIn();
      if (!loggedIn) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircleLoading />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box className="min-h-screen" sx={{ pt: "90px" }}>
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default CommonLayout;
