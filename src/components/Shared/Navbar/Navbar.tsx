/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import coloredLogo from "@/assets/color-logo.png";
import AuthButton from "@/components/Ui/AuthButton/AuthButton";
import { getUserInfo } from "@/services/auth.services";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState<any | null>(undefined);
  console.log("User Info:", userInfo?.role);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "#fff",
        transition: "box-shadow 0.3s ease",
        boxShadow: isScrolled ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Container>
        <Stack
          py={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box component={Link} href="/">
            <Image src={coloredLogo} width={180} height={180} alt="logo" />
          </Box>

          <Stack direction="row" spacing={2}>
            <Typography
              component={Link}
              href="/"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                transition: "color 0.3s ease",
                "&:hover": { color: "primary.main" },
              }}
            >
              HOME
            </Typography>
            <Typography
              component={Link}
              href="/instruction"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                transition: "color 0.3s ease",
                "&:hover": { color: "primary.main" },
              }}
            >
              INSTRUCTION
            </Typography>
            {(userInfo?.role === "admin" ||
              userInfo?.role === "superAdmin") && (
              <Typography
                component={Link}
                href="/dashboard"
                sx={{
                  fontSize: "15px",
                  fontWeight: 600,
                  transition: "color 0.3s ease",
                  "&:hover": { color: "primary.main" },
                }}
              >
                DASHBOARD
              </Typography>
            )}
          </Stack>

          <Box>
            <AuthButton />
            <Button
              component={Link}
              href="https://hice.com.au/"
              target="_blank"
              sx={{ ml: "10px", color: "#fff", fontWeight: 600 }}
            >
              MAIN SITE
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;
