import { Box } from "@mui/material";
// import ProductHeading from "@/components/Ui/Singlepage/ProductHeading/ProductHeading";
import ProductLayoutClient from "@/components/Ui/Singlepage/ProductLayout/ProductLayoutClient";

const productPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* <ProductHeading productId={productId} /> */}
      <ProductLayoutClient productId={productId} />
    </Box>
  );
};

export default productPage;
