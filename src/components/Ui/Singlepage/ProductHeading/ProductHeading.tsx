"use client";

import { useGetProductQuery } from "@/redux/api/productApi";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const ProductHeading = ({ productId }: { productId: string }) => {
  const { data: productData, isLoading: isProductLoading } =
    useGetProductQuery(productId);

  return (
    <Box
      sx={{
        padding: "20px 70px",
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
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              color: "#fff",
              fontSize: "14px",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {productData.codeNumber || "Please put the code number"}
          </Typography>
          <Box
            sx={{
              height: "2px",
              width: "20%",
              backgroundColor: "white",
              margin: "4px 0",
            }}
          ></Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: "#fff",
              fontSize: "14px",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {productData.title || "Please put the title"}
          </Typography>
          <Box
            sx={{
              height: "2px",
              width: "20%",
              backgroundColor: "white",
              margin: "4px 0",
            }}
          ></Box>
          {/* <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              color: "#fff",
              fontSize: "14px",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {productData.category}
          </Typography> */}
          <Link href={`/?category=${productData.category}`}>
            <Typography
              variant="button"
              sx={{
                marginTop: "8px",
                fontWeight: 400,
                color: "#fff",
                fontSize: "14px",
                textAlign: "center",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: "3px 8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transition: "background-color 0.2s",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {productData.category}
            </Typography>
          </Link>
        </Box>
      ) : (
        <Box sx={{ p: 2, color: "#fff" }}>Loading...</Box>
      )}
    </Box>
  );
};

export default ProductHeading;
