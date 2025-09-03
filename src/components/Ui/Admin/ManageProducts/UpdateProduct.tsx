/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import {
  Box,
  Backdrop,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FieldValues, useFormContext, useController } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHSelectField from "@/components/Forms/PHSelectField";
import PHFullScreenModal from "@/components/Shared/PHModal/PHFullScreenModal";
import { useUpdateProductMutation } from "@/redux/api/productApi";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

// ----------------- File Upload Component -----------------
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
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required },
  });

  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    field.onChange(file);
    setTimeout(() => {
      setUploading(false);
    }, 1500);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
  });

  const uploaded = !!field.value;

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 2,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.400",
          borderRadius: 2,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "primary.light" : "background.paper",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
          minHeight: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
        elevation={0}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="primary">
              Uploading...
            </Typography>
          </>
        ) : uploaded ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 50, color: "success.main" }} />
            <Typography variant="body2" color="success.main">
              Uploaded successfully
            </Typography>
            {field.value && (
              <Typography variant="caption" color="text.secondary">
                {field.value.name}
              </Typography>
            )}
          </>
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="body2" color="text.primary">
              {isDragActive ? "Drop here" : label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({accept})
            </Typography>
          </>
        )}
      </Paper>
      {fieldState.error && (
        <Typography variant="caption" color="error">
          {label} is required
        </Typography>
      )}
    </Box>
  );
};

// ----------------- Payload Modifier -----------------
export const modifyUpdatePayload = (values: any) => {
  const { codeNumber, title, category, twoDFile, threeDFile } = values;
  const data: any = {};
  if (codeNumber) data.codeNumber = codeNumber.toUpperCase();
  if (title) data.title = title;
  if (category) data.category = category;

  const formData = new FormData();
  if (Object.keys(data).length > 0) {
    formData.append("data", JSON.stringify(data));
  }
  if (twoDFile instanceof File) {
    formData.append("twoDFile", twoDFile);
  }
  if (threeDFile instanceof File) {
    formData.append("threeDFile", threeDFile);
  }
  return formData;
};

// ----------------- Main Update Product -----------------
type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: any; // TProduct
};

const UpdateProduct = ({ open, setOpen, product }: TProps) => {
  const [updateProduct] = useUpdateProductMutation();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    codeNumber: product.codeNumber || "",
    title: product.title || "",
    category: product.category || "",
    twoDFile: null,
    threeDFile: null,
  };

  const handleFormSubmit = async (values: FieldValues) => {
    const { codeNumber, title, category, twoDFile, threeDFile } = values;

    // Check if at least one field is provided
    if (!codeNumber && !title && !category && !twoDFile && !threeDFile) {
      toast.error("At least one field must be provided to update.");
      return;
    }

    // if (!(twoDFile instanceof File) || !(threeDFile instanceof File)) {
    //   toast.error("Invalid file format for 2D or 3D file.");
    //   return;
    // }

    try {
      setLoading(true);
      console.log("Updating product with values:", values);

      const formData = modifyUpdatePayload({
        codeNumber,
        title,
        category,
        twoDFile,
        threeDFile,
      });

      const res = await updateProduct({
        id: product._id,
        data: formData,
      }).unwrap();
      if (res?._id) {
        toast.success("Product updated successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      console.error("Update product failed:", err);
      toast.error(err?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title="Update Product"
      sx={{ zIndex: 1300 }}
    >
      <PHForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            my: 5,
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            px: 2,
          }}
        >
          <PHInput name="codeNumber" label="Code Number" fullWidth />
          <PHInput name="title" label="Title" fullWidth />
          <PHSelectField
            name="category"
            label="Category"
            items={Object.values(PRODUCT_CATEGORIES)}
            fullWidth
            size="small"
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
            accept="model/gltf-binary,model/gltf+json"
            required={false}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              disabled={loading}
            >
              Update
            </LoadingButton>
          </Box>
        </Box>
      </PHForm>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default UpdateProduct;
