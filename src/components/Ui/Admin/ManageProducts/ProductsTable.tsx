/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "@/redux/api/productApi";
import { toast } from "sonner";
import CreateProduct from "./CreateProduct";

import CircleLoading from "@/components/CircleLoading/CircleLoading";
import UpdateProduct from "./UpdateProduct";

type TProduct = {
  _id: string;
  codeNumber: string;
  title: string;
  category: string;
  twoDUrl: string;
  threeDUrl: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

const ProductsTable = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();
  const products: TProduct[] = data?.products || [];
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const handleAdd = () => {
    setOpenCreateDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        setLoading(true);
        await deleteProduct(deleteId).unwrap();
        toast.success("Product deleted successfully!");
        setDeleteId(null);
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error(error?.data?.message || "Failed to delete product.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateOpen = (product: TProduct) => {
    setSelectedProduct(product);
    setOpenUpdateDialog(true);
  };

  const columns: GridColDef[] = [
    { field: "codeNumber", headerName: "Code Number", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={() => handleUpdateOpen(params.row as TProduct)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setDeleteId(params.row._id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ height: 700, width: "100%" }}>
        <CircleLoading />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Button onClick={handleAdd} variant="contained" sx={{ mb: 2 }}>
        Create Product
      </Button>

      <CreateProduct open={openCreateDialog} setOpen={setOpenCreateDialog} />

      {selectedProduct && (
        <UpdateProduct
          open={openUpdateDialog}
          setOpen={setOpenUpdateDialog}
          product={selectedProduct}
        />
      )}

      <DataGrid
        rows={products}
        getRowId={(row) => row._id}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          "& .MuiDataGrid-cell": {
            border: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
      />

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
        </Box>
      </Backdrop>
    </Box>
  );
};

export default ProductsTable;
