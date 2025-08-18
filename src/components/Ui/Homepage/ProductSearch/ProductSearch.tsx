/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material";
import { debounce } from "lodash";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { TProduct } from "@/types/product";

interface ProductSearchProps {
  onSelect?: (product: TProduct | null) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 500),
    []
  );

  // Fetch products based on search term
  const { data, isLoading, isFetching } = useGetAllProductsQuery(
    { codeNumber: searchTerm },
    { skip: !searchTerm }
  );

  useEffect(() => {
    setLoading(isLoading || isFetching);
    if (data?.products) {
      setOptions(data.products.filter((product) => !product.isDeleted));
    } else {
      setOptions([]);
    }
  }, [data, isLoading, isFetching]);

  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    debouncedSearch(value);
    setSelectLoading(false); // Reset select loading when typing
  };

  const handleSelect = (
    event: React.SyntheticEvent,
    value: TProduct | null,
    reason: AutocompleteChangeReason
  ) => {
    setSelectLoading(true); // Show loading when a product is selected
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <Autocomplete
      id="product-search"
      options={options}
      getOptionLabel={(option) => `${option.codeNumber} - ${option.title}`}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      loading={loading || selectLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by Code Number"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(loading || selectLoading) && (
                  <CircularProgress color="inherit" size={20} />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } =
          props as React.HTMLAttributes<HTMLLIElement> & { key: React.Key };
        return (
          <Box component="li" key={key} {...otherProps}>
            <Box>
              <Typography variant="body1">{option.codeNumber}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.title} ({option.category})
              </Typography>
            </Box>
          </Box>
        );
      }}
      noOptionsText="No products found"
      sx={{ width: 350 }}
    />
  );
};

export default ProductSearch;
