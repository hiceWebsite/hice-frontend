"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import CreateUser from "./CreateUser";

const UserTable = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [initialRole, setInitialRole] = useState<"admin" | "buyer">("admin");

  const handleOpenCreateAdmin = () => {
    setInitialRole("admin");
    setOpenCreateDialog(true);
  };

  const handleOpenCreateBuyer = () => {
    setInitialRole("buyer");
    setOpenCreateDialog(true);
  };

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button onClick={handleOpenCreateAdmin} variant="contained">
          Create Admin
        </Button>
        <Button onClick={handleOpenCreateBuyer} variant="contained">
          Create Buyer
        </Button>
      </Box>

      <CreateUser
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        initialRole={initialRole}
      />
    </Box>
  );
};

export default UserTable;
