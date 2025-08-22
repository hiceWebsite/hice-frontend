import { Box } from "@mui/material";
import ProductLayoutClient from "@/components/Ui/Singlepage/ProductLayout/ProductLayoutClient";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer/Footer";

const productPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  return (
    <Box>
      <Navbar />
      <Box sx={{ pt: "90px" }}>
        <ProductLayoutClient productId={productId} />
      </Box>
      <Footer />
    </Box>
  );
};

export default productPage;
