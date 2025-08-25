import { Button } from "@mui/material";
import Link from "next/link";

const DashboardHomePage = () => {
  return (
    <>
      <Link
        href="/dashboard/change-password"
        style={{ textDecoration: "none" }}
      >
        <Button variant="contained" sx={{ mb: 2 }}>
          Change Password
        </Button>
      </Link>
    </>
  );
};

export default DashboardHomePage;
