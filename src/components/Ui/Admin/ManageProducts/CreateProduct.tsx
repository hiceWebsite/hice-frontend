/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import {
  Box,
  Paper,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FieldValues, useFormContext, useController } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHSelectField from "@/components/Forms/PHSelectField";
import PHFullScreenModal from "@/components/Shared/PHModal/PHFullScreenModal";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  // ✅ added rules: { required } so RHF handles validation

  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);

    // store file in form state
    field.onChange(file);

    // simulate upload animation
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

  // ✅ derived state: uploaded is true if there's a value in RHF
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
        {/* ✅ removed `required` here, RHF handles it now */}
        <input {...getInputProps()} />

        {/* Upload states */}
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

      {/* ✅ show RHF error instead of browser tooltip */}
      {fieldState.error && (
        <Typography variant="caption" color="error">
          {label} is required
        </Typography>
      )}
    </Box>
  );
};

// ----------------- Main Create Product -----------------
export const modifyProductPayload = (values: any) => {
  const { codeNumber, title, category, twoDFile, threeDFile } = values;
  const data = JSON.stringify({ codeNumber, title, category });
  const formData = new FormData();
  formData.append("data", data);
  formData.append("twoDFile", twoDFile as Blob);
  formData.append("threeDFile", threeDFile as Blob);
  return formData;
};

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateProduct = ({ open, setOpen }: TProps) => {
  const [createProduct] = useCreateProductMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    const { codeNumber, title, category, twoDFile, threeDFile } = values;

    const upperCaseCodeNumber = codeNumber.toUpperCase();

    if (
      !upperCaseCodeNumber ||
      !title ||
      !category ||
      !twoDFile ||
      !threeDFile
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!(twoDFile instanceof File) || !(threeDFile instanceof File)) {
      toast.error("Invalid file format for 2D or 3D file.");
      return;
    }

    try {
      setLoading(true);
      const formData = modifyProductPayload({
        codeNumber: upperCaseCodeNumber,
        title,
        category,
        twoDFile,
        threeDFile,
      });
      const res = await createProduct(formData).unwrap();
      if (res?._id) {
        toast.success("Product created successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      console.error("Create product failed:", err);
      toast.error(err?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = {
    codeNumber: "",
    title: "",
    category: "",
    twoDFile: null,
    threeDFile: null,
  };

  return (
    <PHFullScreenModal
      open={open}
      setOpen={setOpen}
      title="Create New Product"
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
          <PHInput name="codeNumber" label="Code Number" fullWidth required />
          <PHInput name="title" label="Title" fullWidth required />
          <PHSelectField
            name="category"
            label="Category"
            items={Object.values(PRODUCT_CATEGORIES)}
            fullWidth
            required
            size="small"
          />
          <FileUpload
            name="twoDFile"
            label="2D Image"
            accept="image/*"
            required
          />
          <FileUpload
            name="threeDFile"
            label="3D Model"
            accept=".glb,.gltf"
            required
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              // loading={loading}
              // disabled={loading}
            >
              Create
            </LoadingButton>
          </Box>
        </Box>
      </PHForm>

      {/* Full-page overlay loader */}
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

export default CreateProduct;
