/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import coloredLogo from "@/assets/color-logo.png";
import AuthButton from "@/components/Ui/AuthButton/AuthButton";
import { getUserInfo } from "@/services/auth.services";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState<any | null>(undefined);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 250, p: 2, bgcolor: "#fff", height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleDrawerToggle} sx={{ mb: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <button onClick={handleDrawerToggle}>
          <Typography
            component={Link}
            href="/"
            sx={{
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
              transition: "color 0.3s ease",
              "&:hover": { color: "primary.main" },
              textDecoration: "none",
            }}
          >
            HOME
          </Typography>
        </button>
        <button onClick={handleDrawerToggle}>
          <Typography
            component={Link}
            href="/instruction"
            sx={{
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
              transition: "color 0.3s ease",
              "&:hover": { color: "primary.main" },
              textDecoration: "none",
            }}
          >
            INSTRUCTION
          </Typography>
        </button>
        {(userInfo?.role === "admin" || userInfo?.role === "superAdmin") && (
          <button onClick={handleDrawerToggle}>
            <Typography
              component={Link}
              href="/dashboard"
              sx={{
                fontSize: { xs: "14px", sm: "15px" },
                fontWeight: 600,
                transition: "color 0.3s ease",
                "&:hover": { color: "primary.main" },
                textDecoration: "none",
              }}
            >
              DASHBOARD
            </Typography>
          </button>
        )}
        <Button
          component={Link}
          href="https://hice.com.au/"
          target="_blank"
          sx={{
            color: "#fff",
            fontWeight: 600,
            fontSize: { xs: "12px", sm: "14px" },
          }}
        >
          MAIN SITE
        </Button>

        <AuthButton />
      </Stack>
    </Box>
  );

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
            <Image
              src={coloredLogo}
              width={180}
              height={180}
              alt="logo"
              style={{ width: "auto", height: "40px" }} // Responsive logo size
            />
          </Box>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              display: { xs: "none", md: "flex" }, // Hide on mobile, show on md+
              alignItems: "center",
            }}
          >
            <Typography
              component={Link}
              href="/"
              sx={{
                fontSize: { xs: "14px", sm: "15px" },
                fontWeight: 600,
                transition: "color 0.3s ease",
                "&:hover": { color: "primary.main" },
                textDecoration: "none",
              }}
            >
              HOME
            </Typography>
            <Typography
              component={Link}
              href="/instruction"
              sx={{
                fontSize: { xs: "14px", sm: "15px" },
                fontWeight: 600,
                transition: "color 0.3s ease",
                "&:hover": { color: "primary.main" },
                textDecoration: "none",
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
                  fontSize: { xs: "14px", sm: "15px" },
                  fontWeight: 600,
                  transition: "color 0.3s ease",
                  "&:hover": { color: "primary.main" },
                  textDecoration: "none",
                }}
              >
                DASHBOARD
              </Typography>
            )}
          </Stack>

          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <AuthButton />
            <Button
              component={Link}
              href="https://hice.com.au/"
              target="_blank"
              sx={{
                ml: { xs: "5px", sm: "10px" },
                color: "#fff",
                fontWeight: 600,
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              MAIN SITE
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }} // Show only on mobile
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", md: "none" } }} // Show only on mobile
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Navbar;
