import React, { useState } from 'react';
import { Box, Grid, Button } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid/index';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import DialogModel from 'common/Dialog';
import AddIcon from '@material-ui/icons/Add';
import deptService from 'services/dept.Request';
import { deptSelector, isLoadingSelector } from 'selectors/dept.selector';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import loadingImg from '../../assets/images/blue_loading.gif';
import AddDeptModal from './AddDeptModal';
import EditDeptModel from './EditDeptModel';
import { deptStyle } from './dept.style';

export default function DepartmentList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const loading: boolean = useSelector(isLoadingSelector);
  const classes = deptStyle();

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    dispatch(deptService.fetchDepartmentList());
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'departmentName',
      headerName: 'Department Name',
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
      description: 'Edit and Remove Department',
      flex: 0.5,
      sortable: false,
      align: 'left',
      renderCell: (param: any) => {
        const onClickDelDept = (): void => {
          const deptId = param.row.departmentId;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the department status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await deptService.deleteDept(deptId);
              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(deptService.fetchDepartmentList());
            }
          });
        };

        const onClickEditDept = async (): Promise<void> => {
          const response = await deptService.fetchDepartmentById(param?.row.departmentId);

          setIsOpenEditModal(true);
          setEditRow(response?.data.department);
        };

        return (
          <>
            <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditDept()}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelDept()}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end', marginBottom: '15px' }}>
        <DialogModel
          open={isOpen}
          title="Add Leave"
          dialogContent={<AddDeptModal handleCloseDialog={handleCloseDialog} isOpen={isOpen} deptData={deptData} />}
        />

        <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
          Add Department
        </SecondayButton>
      </Grid>

      <Grid item xs={12}>
        {loading ? (
          <img className={classes.loader} src={loadingImg} alt="loding-img" />
        ) : (
          <>
            {deptData && deptData !== null && (
              <CustomDataGrid rows={deptData || []} columns={columns} getRowId={(row) => row?.departmentId} loading={loading} />
            )}
          </>
        )}
      </Grid>

      {isOpenEditModal && (
        <DialogModel
          open={isOpenEditModal}
          title="Edit client"
          dialogContent={<EditDeptModel data={editRow} handleCloseDialog={handleCloseDialog} isOpen={isOpenEditModal} />}
        />
      )}
    </div>
  );
}
