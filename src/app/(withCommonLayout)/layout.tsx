"use client";

import Footer from "@/components/Shared/Footer/Footer";
import Navbar from "@/components/Shared/Navbar/Navbar";
import { isLoggedIn } from "@/services/auth.services";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

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
