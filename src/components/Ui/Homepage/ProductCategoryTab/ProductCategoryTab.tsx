"use client";

import CircleLoading from "@/components/CircleLoading/CircleLoading";
import CustomTabComponent from "@/components/Tabs/CustomTabComponent";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { Container } from "@mui/material";

const ProductCategoryTab = () => {
  const { isLoading } = useGetAllProductsQuery({});

  // console.log(doctors);

  return (
    <Container>
      {!isLoading ? <CustomTabComponent sx={{}} /> : <CircleLoading />}
    </Container>
  );
};

export default ProductCategoryTab;
