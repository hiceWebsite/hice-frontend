/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DashboardDrawer from "@/components/Dashboard/DashboardDrawer/DashboardDrawer";
import { getUserInfo, isLoggedIn } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "@/app/not-found"; // ✅ import the 404 page

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<any | null>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const info = getUserInfo();
    setUserInfo(info ?? null);
    setLoading(false);
  }, [router]);

  if (loading) return null;

  // if role is NOT admin or superAdmin → show 404
  if (!(userInfo?.role === "admin" || userInfo?.role === "superAdmin")) {
    return <NotFound />; // ✅ renders your /app/not-found.tsx
  }

  return <DashboardDrawer>{children}</DashboardDrawer>;
};

export default DashboardLayout;
