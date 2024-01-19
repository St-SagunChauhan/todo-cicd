import React, { useState } from 'react';
import { Box, Grid, Button } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid/index';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import DialogModel from 'common/Dialog';
import AddIcon from '@material-ui/icons/Add';
import deptService from 'services/dept.Request';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { expenseCategoryError, expenseCategorySelector, isLoadingSelector } from 'selectors/expenseCategory.selector';
import expenseCategoryService from 'services/expenseCategory.Request';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import AddExpenseCategoryModal from './AddExpenseCategoryModal';
import EditExpenseCategoryModel from './EditExpenseCategoryModal';
import loadingImg from '../../assets/images/blue_loading.gif';
import { ExpenseCategoryStyle } from './ExpenseCategory.style';

export default function DepartmentList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const dispatch = useDispatch();
  const expenseCategoryData = useSelector(expenseCategorySelector);
  const loading: boolean = useSelector(isLoadingSelector);
  const classes = ExpenseCategoryStyle();

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  React.useEffect(() => {
    dispatch(expenseCategoryService.fetchExpenseCategoryList());
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'categoryName',
      headerName: 'Category Name',
      flex: 1,
      editable: true,
    },
    {
      renderCell: (rowData: any) => {
        return rowData.row.isActive ? 'Active' : 'Inactive';
      },
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Expense Category',
      flex: 0.5,
      sortable: false,
      align: 'left',
      renderCell: (param: any) => {
        const onClickDelExpenseCategory = (): void => {
          const CategoryId = param.row.expenseCategoryId;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the Expense Category status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await expenseCategoryService.deleteExpenseCategory(CategoryId);
              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(expenseCategoryService.fetchExpenseCategoryList());
            }
          });
        };

        const onClickEditExpenseCategory = async (): Promise<void> => {
          const response = await expenseCategoryService.fetchExpenseCategoryById(param?.row.expenseCategoryId);

          setIsOpenEditModal(true);
          setEditRow(response?.data.expenseCategoryResult);
        };

        return (
          <>
            <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditExpenseCategory()}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelExpenseCategory()}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end', marginBottom: '15px' }}>
        <DialogModel
          open={isOpen}
          title="Add Expense Category"
          dialogContent={
            <AddExpenseCategoryModal
              handleCloseDialog={handleCloseDialog}
              isOpen={isOpen}
              expenseCategoryData={expenseCategoryData}
            />
          }
        />

        <SecondayButton startIcon={<GridAddIcon />} onClick={() => setIsOpen(true)}>
          Add Expense Category
        </SecondayButton>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {loading ? (
            <img className={classes.loader} src={loadingImg} alt="loding-img" />
          ) : (
            <>
              {expenseCategoryData && expenseCategoryData !== null && (
                <CustomDataGrid
                  rows={expenseCategoryData || []}
                  columns={columns}
                  getRowId={(row) => row?.expenseCategoryId}
                  loading={loading}
                />
              )}
            </>
          )}
        </Grid>
      </Grid>
      {isOpenEditModal && (
        <DialogModel
          open={isOpenEditModal}
          title="Edit Expense Category"
          dialogContent={
            <EditExpenseCategoryModel data={editRow} handleCloseDialog={handleCloseDialog} isOpen={isOpenEditModal} />
          }
        />
      )}
    </>
  );
}
