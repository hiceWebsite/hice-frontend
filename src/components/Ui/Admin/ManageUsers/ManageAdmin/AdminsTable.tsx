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
import { toast } from "sonner";
import CreateAdmin from "./CreateAdmin";
import PHForm from "@/components/Forms/PHForm";
import {
  FormProvider,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetAllAdminsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "@/redux/api/adminApi";
import CircleLoading from "@/components/CircleLoading/CircleLoading";

export type TAdmin = {
  _id: string;
  user: {
    _id: string;
    email: string;
    needsPasswordChange: boolean;
    role: "admin";
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  name: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  email: string;
  profileImg: string;
  isDeleted: boolean;
  fullName: string;
  address?: string;
  id: string;
};

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

const adminValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email").min(1, "Email is required"),
  address: z.string().optional(),
});

const AdminsTable = () => {
  const { data, isLoading } = useGetAllAdminsQuery({});
  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const admins: TAdmin[] = data?.admins || [];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateRow, setUpdateRow] = useState<TAdmin | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(adminValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (updateRow) {
      methods.reset({
        firstName: updateRow.name?.firstName || "",
        lastName: updateRow.name?.lastName || "",
        email: updateRow.user?.email || "",
      });
    } else {
      methods.reset({
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  }, [updateRow, methods]);

  const handleAdd = () => {
    setOpenCreateDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const res = await deleteAdmin(deleteId).unwrap();
        toast.success(res.message || "Admin deleted successfully!");
        setDeleteId(null);
      } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to delete admin.";
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateOpen = (row: TAdmin) => {
    setUpdateRow(row);
  };
  const handleUpdateClose = () => {
    setUpdateRow(null);
  };

  const handleUpdateSave: SubmitHandler<FormValues> = async (values) => {
    if (updateRow) {
      try {
        await updateAdmin({
          id: updateRow._id,
          body: {
            admin: {
              name: {
                firstName: values.firstName,
                lastName: values.lastName,
              },
              //   email: values.email,
            },
          },
        }).unwrap();
        toast.success("Admin updated successfully!");
        setUpdateRow(null);
      } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to update admin.";
        toast.error(errorMessage);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      renderCell: (params) => params.row?.fullName || "",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => params.row?.user?.email || "",
    },
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={() => handleUpdateOpen(params.row as TAdmin)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => setDeleteId(params.row?._id || null)}
            color="error"
          >
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
        Create Admin
      </Button>

      <CreateAdmin open={openCreateDialog} setOpen={setOpenCreateDialog} />

      <DataGrid
        rows={admins}
        getRowId={(row) => row._id}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          "& .MuiDataGrid-cell": { border: "1px solid rgba(224, 224, 224, 1)" },
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
            Are you sure you want to delete this admin?
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
        <DialogTitle>Update Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the admin details below.</DialogContentText>
          <FormProvider {...methods}>
            <PHForm
              onSubmit={
                methods.handleSubmit(
                  handleUpdateSave
                ) as SubmitHandler<FieldValues>
              }
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  {...methods.register("firstName")}
                  label="First Name"
                  fullWidth
                  required
                  error={!!methods.formState.errors.firstName}
                  helperText={methods.formState.errors.firstName?.message}
                />
                <TextField
                  {...methods.register("lastName")}
                  label="Last Name"
                  fullWidth
                  required
                  error={!!methods.formState.errors.lastName}
                  helperText={methods.formState.errors.lastName?.message}
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

export default AdminsTable;
