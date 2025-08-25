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
import CreateBuyer from "./CreateBuyer";
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
  useGetAllBuyersQuery,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,
} from "@/redux/api/buyerApi";
import CircleLoading from "@/components/CircleLoading/CircleLoading";

export type TBuyer = {
  _id: string;
  user: {
    _id: string;
    email: string;
    needsPasswordChange: boolean;
    role: string;
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
  address: string;
  profileImg: string;
  isDeleted: boolean;
  fullName: string;
  id: string;
};

interface BuyerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

const buyerValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email").min(1, "Email is required"),
  address: z.string().optional(),
});

const BuyersTable = () => {
  const { data, isLoading } = useGetAllBuyersQuery({});
  const [updateBuyer] = useUpdateBuyerMutation();
  const [deleteBuyer] = useDeleteBuyerMutation();
  const buyers: TBuyer[] = data?.buyers || [];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateRow, setUpdateRow] = useState<TBuyer | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const methods = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (updateRow) {
      methods.reset({
        firstName: updateRow.name?.firstName || "",
        lastName: updateRow.name?.lastName || "",
        email: updateRow.user?.email || "",
        address: updateRow.address || "",
      });
    } else {
      methods.reset({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
      });
    }
  }, [updateRow, methods]);

  const handleAdd = () => {
    setOpenCreateDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const res = await deleteBuyer(deleteId).unwrap();
        toast.success(res.message || "Buyer deleted successfully!");
        setDeleteId(null);
      } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to delete buyer.";
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateOpen = (row: TBuyer) => setUpdateRow(row);
  const handleUpdateClose = () => setUpdateRow(null);

  const handleUpdateSave: SubmitHandler<BuyerFormValues> = async (values) => {
    if (updateRow) {
      try {
        await updateBuyer({
          id: updateRow._id,
          body: {
            buyer: {
              name: { firstName: values.firstName, lastName: values.lastName },
              address: values.address,
            },
          },
        }).unwrap();
        toast.success("Buyer updated successfully!");
        setUpdateRow(null);
      } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to update buyer.";
        toast.error(errorMessage);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 }, // NEW
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={() => handleUpdateOpen(params.row as TBuyer)}
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
        Create Buyer
      </Button>

      <CreateBuyer open={openCreateDialog} setOpen={setOpenCreateDialog} />

      <DataGrid
        rows={buyers}
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
            Are you sure you want to delete this buyer?
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
        <DialogTitle>Update Buyer</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the buyer details below.</DialogContentText>
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
                />
                <TextField
                  {...methods.register("lastName")}
                  label="Last Name"
                  fullWidth
                  required
                />
                <TextField
                  {...methods.register("address")}
                  label="Address"
                  fullWidth
                />{" "}
                {/* NEW */}
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

export default BuyersTable;
