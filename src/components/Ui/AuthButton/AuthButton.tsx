/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getUserInfo, removeUser } from "@/services/auth.services";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const AuthButton = () => {
  const [userInfo, setUserInfo] = useState<any | null>(undefined);
  const router = useRouter();

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  const handleLogout = () => {
    removeUser();
    setUserInfo(null);
    router.push("/login");
  };

  // While loading (undefined), show nothing
  if (userInfo === undefined) return null;

  return userInfo?.userEmail ? (
    <button onClick={handleLogout} className="mui-btn mui-btn--contained-error">
      Logout
    </button>
  ) : (
    <Button
      component={Link}
      href="/login"
      sx={{ color: "#fff", fontWeight: 600, textTransform: "none" }}
    >
      Login
    </Button>
  );
};

export default AuthButton;
