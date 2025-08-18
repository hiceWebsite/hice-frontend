"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { TProduct } from "@/types/product";
import ProductSearch from "./ProductSearch";

const ProductSearchPage: React.FC = () => {
  const router = useRouter();

  const handleProductSelect = (product: TProduct | null) => {
    if (product?._id) {
      router.push(`/product/${product._id}`);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <ProductSearch onSelect={handleProductSelect} />
        </Box>
      </Box>
    </Container>
  );
};

export default ProductSearchPage;
