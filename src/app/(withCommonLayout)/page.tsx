import HeroSection from "@/components/Ui/Homepage/HeroSection/HeroSection";
import ProductCategoryTab from "@/components/Ui/Homepage/ProductCategoryTab/ProductCategoryTab";
import ProductSearchPage from "@/components/Ui/Homepage/ProductSearch/ProductSearchPage";

const page = () => {
  return (
    <>
      <HeroSection />
      <ProductSearchPage />
      <ProductCategoryTab />
    </>
  );
};

export default page;
