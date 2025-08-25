/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/redux/api/productApi";
import { modifyPayload } from "@/utils/modifyPayload";
import { toast } from "sonner";
import CreateProduct from "./CreateProduct";
import PHForm from "@/components/Forms/PHForm";
import {
  FieldValues,
  useController,
  useFormContext,
  SubmitHandler,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircleLoading from "@/components/CircleLoading/CircleLoading";

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

// Form values type
interface FormValues {
  codeNumber: string;
  title: string;
  category: string;
  twoDFile?: File | null;
  threeDFile?: File | null;
}

// Zod validation schema
const productValidationSchema = z.object({
  codeNumber: z.string().min(1, "Code Number is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  twoDFile: z.any().optional(),
  threeDFile: z.any().optional(),
});

// Reused FileUpload component from CreateProduct
interface FileUploadProps {
  name: string;
  label: string;
  accept: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  accept,
  required,
}) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        field.onChange(acceptedFiles[0]);
      }
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
  });

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 1,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.400",
          borderRadius: 1,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "primary.light" : "background.paper",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
          minHeight: 60,
        }}
        elevation={0}
      >
        <input {...getInputProps()} required={required} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 24, color: "primary.main" }} />
          <Box>
            <Typography variant="body2" color="text.primary">
              {isDragActive ? "Drop here" : `${label}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`(${accept})`}
            </Typography>
            {field.value && (
              <Typography variant="caption" color="success.main">
                {field.value.name}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const ProductsTable = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const products: TProduct[] = data?.products || [];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateRow, setUpdateRow] = useState<TProduct | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Initialize useForm with resolver
  const methods = useForm<FormValues>({
    resolver: zodResolver(productValidationSchema),
    defaultValues: {
      codeNumber: "",
      title: "",
      category: "",
      twoDFile: null,
      threeDFile: null,
    },
  });

  // Reset form values when updateRow changes
  useEffect(() => {
    if (updateRow) {
      methods.reset({
        codeNumber: updateRow.codeNumber,
        title: updateRow.title,
        category: updateRow.category,
        twoDFile: null,
        threeDFile: null,
      });
    } else {
      methods.reset({
        codeNumber: "",
        title: "",
        category: "",
        twoDFile: null,
        threeDFile: null,
      });
    }
  }, [updateRow, methods]);

  const handleAdd = () => {
    setOpenCreateDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteProduct(deleteId).unwrap();
        toast.success("Product deleted successfully!");
        setDeleteId(null);
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleUpdateOpen = (row: TProduct) => {
    setUpdateRow(row);
  };

  const handleUpdateClose = () => {
    setUpdateRow(null);
  };

  const handleUpdateSave: SubmitHandler<FormValues> = async (values) => {
    if (updateRow) {
      try {
        const payload = {
          codeNumber: values.codeNumber.toUpperCase(),
          title: values.title,
          category: values.category,
          twoDFile: values.twoDFile || undefined,
          threeDFile: values.threeDFile || undefined,
        };
        const formData = modifyPayload(payload);
        await updateProduct({
          id: updateRow._id,
          body: formData,
        }).unwrap();
        toast.success("Product updated successfully!");
        setUpdateRow(null);
      } catch (error: any) {
        console.error("Update failed:", error);
        toast.error(error?.message || "Failed to update product.");
      }
    }
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
        <CircleLoading />;
      </Box>
    );
  }

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Button onClick={handleAdd} variant="contained" sx={{ mb: 2 }}>
        Create Product
      </Button>

      <CreateProduct open={openCreateDialog} setOpen={setOpenCreateDialog} />

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
          <button
            onClick={handleDelete}
            className="mui-btn mui-btn--contained-error"
          >
            DELETE
          </button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateRow !== null} onClose={handleUpdateClose}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the product details below.</DialogContentText>
          <FormProvider {...methods}>
            <PHForm
              onSubmit={
                methods.handleSubmit(
                  handleUpdateSave
                ) as SubmitHandler<FieldValues>
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 2,
                }}
              >
                <TextField
                  {...methods.register("codeNumber", {
                    setValueAs: (value: string) => value.toUpperCase(),
                  })}
                  label="Code Number"
                  fullWidth
                  required
                  error={!!methods.formState.errors.codeNumber}
                  helperText={methods.formState.errors.codeNumber?.message}
                />
                <TextField
                  {...methods.register("title")}
                  label="Title"
                  fullWidth
                  required
                  error={!!methods.formState.errors.title}
                  helperText={methods.formState.errors.title?.message}
                />
                <TextField
                  {...methods.register("category")}
                  label="Category"
                  fullWidth
                  required
                  error={!!methods.formState.errors.category}
                  helperText={methods.formState.errors.category?.message}
                />
                <FileUpload
                  name="twoDFile"
                  label="2D Image"
                  accept="image/*"
                  required={false}
                />
                <FileUpload
                  name="threeDFile"
                  label="3D Model"
                  accept=".glb,.gltf"
                  required={false}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button onClick={handleUpdateClose}>Cancel</Button>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </Box>
              </Box>
            </PHForm>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductsTable;
