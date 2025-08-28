/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  Typography,
  Pagination,
  Skeleton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ThreeModelViewer from "../ThreeModelViewer/ThreeModelViewer";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { TProduct } from "@/types/product";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { TMeta } from "@/types";

interface TabPanelProps {
  children: TProduct[];
  value: number;
  index: number;
}

interface CustomTabsProps {
  sx?: object;
  initialValue?: number;
}

const CustomTab = styled(Tab)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "5px",
  textTransform: "none",
  minWidth: "100px",
  marginRight: "10px",
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
  "&.Mui-selected": {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: "white",
    border: "none",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
  height: "100%",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[1],
  },
}));

const CustomTabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Grid container spacing={3}>
            {children?.map((product, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 4 }}>
                <Link href={`/product/${product._id}`} target="_blank">
                  <StyledCard>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "170px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <ThreeModelViewer
                        modelUrl={product.threeDUrl}
                        height="100%"
                        width="100%"
                        adjustCamera={1.3}
                        enableZoom={false}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mt={3}
                    >
                      {product.codeNumber}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      mt={-1}
                    >
                      {product.category}
                    </Typography>
                    <Typography
                      variant="h6"
                      textAlign="center"
                      mt={1}
                      color="text.secondary"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      {product.title}
                    </Typography>
                  </StyledCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
};

const CustomTabComponent: React.FC<CustomTabsProps> = ({
  sx,
  initialValue = 0,
}) => {
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category");
  const pageFromQuery = parseInt(searchParams.get("page") || "1", 6);

  const [value, setValue] = useState(initialValue);
  const [currentPage, setCurrentPage] = useState(pageFromQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    categoryFromQuery || undefined
  );

  const { data, isLoading } = useGetAllProductsQuery({
    limit: 6,
    page: currentPage,
    category: selectedCategory,
  });
  const products: TProduct[] = data?.products || [];
  const meta: TMeta = data?.meta || { page: 1, limit: 9, total: 0 };

  const categoryTab = [
    { label: PRODUCT_CATEGORIES.FOOTING },
    { label: PRODUCT_CATEGORIES.DRAINAGE },
    { label: PRODUCT_CATEGORIES.FRAMING },
    { label: PRODUCT_CATEGORIES.RECTIFICATION },
    { label: PRODUCT_CATEGORIES.RETAINING_WALLS },
    { label: PRODUCT_CATEGORIES.TIMBER_SUBFLOOR },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedCategory(categoryTab[newValue].label);
    setCurrentPage(1); // Reset to page 1 when changing tabs
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (categoryFromQuery) {
      const idx = categoryTab.findIndex((c) => c.label === categoryFromQuery);
      if (idx !== -1) {
        setValue(idx);
        setSelectedCategory(categoryFromQuery);
      }
    }
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryTab[value].label);
  }, [value]);

  const totalPages = Math.ceil((meta.total || 0) / (meta.limit || 6));

  // Filter products for the selected tab
  const filteredProductsForTab = (tabLabel: string) => {
    if (selectedCategory === tabLabel) {
      return products;
    }
    return []; // Show empty for non-selected tabs
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          }}
          gap={3}
        >
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={300}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="custom button tabs"
          sx={{ "& .MuiTabs-indicator": { display: "none" } }}
        >
          {categoryTab.map((tab, index) => (
            <CustomTab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      {categoryTab.map((tab, index) => (
        <Box key={index}>
          <CustomTabPanel value={value} index={index}>
            {filteredProductsForTab(tab.label)}
          </CustomTabPanel>
          {value === index && totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 1,
                mb: 8,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "8px",
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "primary.light",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CustomTabComponent;
