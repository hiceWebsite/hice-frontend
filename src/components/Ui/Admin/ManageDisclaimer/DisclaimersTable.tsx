/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useGetAllDisclaimersQuery,
  useUpdateDisclaimerMutation,
  useDeleteDisclaimerMutation,
} from "@/redux/api/disclaimerApi";
import { toast } from "sonner";
import CreateDisclaimer from "./CreateDisclaimer";
import PHForm from "@/components/Forms/PHForm";
import {
  FieldValues,
  FormProvider,
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type TDisclaimer = {
  _id: string;
  disDescription: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

// Form values type
interface FormValues {
  disDescription: string;
}

// Zod validation schema
const disclaimerValidationSchema = z.object({
  disDescription: z.string().min(1, "Description is required"),
});

const DisclaimersTable = () => {
  const { data, isLoading } = useGetAllDisclaimersQuery({});
  const [updateDisclaimer] = useUpdateDisclaimerMutation();
  const [deleteDisclaimer] = useDeleteDisclaimerMutation();
  const disclaimers: TDisclaimer[] = data?.disclaimers || [];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateRow, setUpdateRow] = useState<TDisclaimer | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Initialize useForm with resolver
  const methods = useForm<FormValues>({
    resolver: zodResolver(disclaimerValidationSchema),
    defaultValues: {
      disDescription: "",
    },
  });

  // Reset form values when updateRow changes
  useEffect(() => {
    if (updateRow) {
      methods.reset({
        disDescription: updateRow.disDescription,
      });
    } else {
      methods.reset({
        disDescription: "",
      });
    }
  }, [updateRow, methods]);

  const handleAdd = () => {
    setOpenCreateDialog(true);
  };

  const handleDelete = async () => {
    console.log("Delete ID:", deleteId);

    if (deleteId !== null) {
      try {
        await deleteDisclaimer(deleteId).unwrap();

        toast.success("Disclaimer deleted successfully!");
        setDeleteId(null);
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error(error?.message || "Failed to delete disclaimer.");
      }
    }
  };

  const handleUpdateOpen = (row: TDisclaimer) => {
    setUpdateRow(row);
  };

  const handleUpdateClose = () => {
    setUpdateRow(null);
  };

  const handleUpdateSave: SubmitHandler<FormValues> = async (values) => {
    if (updateRow) {
      try {
        await updateDisclaimer({
          id: updateRow._id,
          body: { disDescription: values.disDescription },
        }).unwrap();
        toast.success("Disclaimer updated successfully!");
        setUpdateRow(null);
      } catch (error: any) {
        console.error("Update failed:", error);
        toast.error(error?.message || "Failed to update disclaimer.");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "disDescription", headerName: "Description", flex: 1 },
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={() => handleUpdateOpen(params.row as TDisclaimer)}
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
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Button onClick={handleAdd} variant="contained" sx={{ mb: 2 }}>
        Create Disclaimer
      </Button>

      <CreateDisclaimer open={openCreateDialog} setOpen={setOpenCreateDialog} />

      <DataGrid
        rows={disclaimers}
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
            Are you sure you want to delete this disclaimer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateRow !== null} onClose={handleUpdateClose}>
        <DialogTitle>Update Disclaimer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the disclaimer details below.
          </DialogContentText>
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
                  {...methods.register("disDescription")}
                  label="Description"
                  fullWidth
                  required
                  error={!!methods.formState.errors.disDescription}
                  helperText={methods.formState.errors.disDescription?.message}
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

export default DisclaimersTable;
