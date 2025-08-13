/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FieldValues, useController, useFormContext } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHFullScreenModal from "@/components/Shared/PHModal/PHFullScreenModal";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
  const { field } = useController({ name, control });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
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
              {isDragActive ? "Drop here" : label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({accept})
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

    if (!codeNumber || !title || !category || !twoDFile || !threeDFile) {
      toast.error("All fields are required.");
      return;
    }
    if (!(twoDFile instanceof File) || !(threeDFile instanceof File)) {
      toast.error("Invalid file format for 2D or 3D file.");
      return;
    }

    try {
      setLoading(true);
      const formData = modifyProductPayload(values);
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
          <PHInput name="category" label="Category" fullWidth required />
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
              loading={loading}
              disabled={loading}
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
          <Typography variant="body1" fontWeight={500}>
            Creating product, please wait...
          </Typography>
        </Box>
      </Backdrop>
    </PHFullScreenModal>
  );
};

export default CreateProduct;
