"use client";

import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import SwipeableDrawer from "@/components/Drawer/SwipeableDrawer";
import ProductPageClient from "@/app/(withCommonLayout)/product/[productId]/singleProductPage";

export default function ProductLayoutClient({
  productId,
}: {
  productId: string;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const theme = useTheme();
  const drawerWidth = isDrawerOpen ? 525 : 100;

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <SwipeableDrawer
        productId={productId}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />

      <Box
        sx={{
          ml: `${drawerWidth}px`,
          width: `calc(100vw - ${drawerWidth}px)`,
          height: "100vh",
          transition: theme.transitions.create(["margin-left", "width"], {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
          overflow: "hidden",
        }}
      >
        <ProductPageClient productId={productId} />
      </Box>
    </Box>
  );
}
