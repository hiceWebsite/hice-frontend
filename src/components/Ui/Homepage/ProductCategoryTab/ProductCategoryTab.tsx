"use client";

import CircleLoading from "@/components/CircleLoading/CircleLoading";
import CustomTabComponent from "@/components/Tabs/CustomTabComponent";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { Container } from "@mui/material";

const ProductCategoryTab = () => {
  const { data, isLoading } = useGetAllProductsQuery({});

  // console.log(data);
  const products = data?.products || [];

  // console.log(doctors);

  return (
    <Container>
      {!isLoading ? (
        <CustomTabComponent products={products} sx={{}} />
      ) : (
        <CircleLoading />
      )}
    </Container>
  );
};

export default ProductCategoryTab;
