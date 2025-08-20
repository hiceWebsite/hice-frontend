"use client";

import ThreeModelViewer from "@/components/ThreeModelViewer/ThreeModelViewer";
import { useGetProductQuery } from "@/redux/api/productApi";
import { useTheme } from "@mui/material";

export default function ProductPageClient({
  productId,
}: {
  productId: string;
}) {
  const { data, isLoading } = useGetProductQuery(productId);
  const theme = useTheme();

  return (
    <div
      className="w-full h-full flex justify-center items-center relative overflow-hidden bg-black"
      style={{
        transition: theme.transitions.create(["width", "margin"], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut,
        }),
      }}
    >
      {!isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            transition: theme.transitions.create(["width", "height"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
          }}
        >
          <ThreeModelViewer
            modelUrl={data?.threeDUrl}
            height="100%"
            width="100%"
            adjustCamera={1.5}
          />
        </div>
      ) : (
        <h1>Loading.....</h1>
      )}
    </div>
  );
}
