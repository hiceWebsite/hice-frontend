"use client";

import { useGetProductQuery } from "@/redux/api/productApi";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const ProductHeading = ({ productId }: { productId: string }) => {
  const { data: productData, isLoading: isProductLoading } =
    useGetProductQuery(productId);

  return (
    <Box
      sx={{
        height: "170px",
        width: "100%",
        background: "linear-gradient(45deg, #00AEEF, #0C2E6E)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {!isProductLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 400, color: "#fff" }}>
            {productData.codeNumber || "Please put the code number"}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff" }}>
            {productData.title || "Please put the title"}
          </Typography>
          <Box
            sx={{
              height: "2px",
              width: "40%",
              backgroundColor: "white",
              marginTop: 1,
            }}
          ></Box>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#fff" }}>
            {productData.category}
          </Typography>
          <a
            href={productData.twoDUrl || "/placeholder-image.png"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={productData.twoDUrl || "/placeholder-image.png"}
              alt={productData?.title}
              width={300}
              height={300}
              style={{ borderRadius: "8px", marginTop: "5px" }}
            />
          </a>
        </Box>
      ) : (
        <Box sx={{ p: 2, color: "#fff" }}>Loading...</Box>
      )}
    </Box>
  );
};

export default ProductHeading;
