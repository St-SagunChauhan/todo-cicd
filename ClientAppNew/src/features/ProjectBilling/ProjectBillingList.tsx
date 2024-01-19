import React, { useRef, useState } from 'react';
import { Box, Paper, Button, Grid, FormControl, MenuItem, Select } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid/index';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogModel from 'common/Dialog';
import Swal from 'sweetalert2';
import projectBillingService from 'services/projectBilling.Request';
import { projectBillingSelector, isLoadingSelector } from 'selectors/projectBilling.selector';
import { roleSelector } from 'selectors/auth.selector';
import { USER_ROLE } from 'configs';
import { deptSelector } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import { setLoading } from 'actions/app.action';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { projectBillingStyle } from './projectBilling.style';
import loadingImg from '../../assets/images/blue_loading.gif';
import AddProjectBllingModal from './AddProjectBillingModal';
import EditProjectBillingModal from './EditProjectBillingModal';

export default function ProjectBillingList() {
  const refFile = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const classes = projectBillingStyle();
  const dispatch = useDispatch();
  useSelector(isLoadingSelector);
  const loading = useSelector(isLoadingSelector);
  const billingData = useSelector(projectBillingSelector);
  const role = useSelector(roleSelector);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const [selectedDept, setSelectedDept] = useState('all');
  const deptData = useSelector(deptSelector);

  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    const deptFilter = selectedDept === 'all' ? null : selectedDept;
    dispatch(projectBillingService.fetchProjectBillingList(undefined, undefined, deptFilter || undefined));
  }, [dispatch]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFileList(e.target.files);
    setLoading(true);
    const response = await projectBillingService.ImportProjectBilling(e.target.files);
    if (response.status === 400) {
      Swal.fire({
        customClass: 'alertBottomRight',
        position: 'center',
        icon: 'error',
        title: response.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
    } else {
      Swal.fire({
        customClass: 'alertBottomRight',
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      const departFilter = selectedDept === 'all' ? null : selectedDept;
      dispatch(projectBillingService.fetchProjectBillingList(undefined, undefined, departFilter || undefined));
      setLoading(false);
      e.target.value = '';
    }
  };

  const handelDownload = async () => {
    try {
      await projectBillingService.exportProjectbilling();
    } catch (error) {
      throw Error();
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'projectName',
      headerName: 'Contract Name',
      flex: 1,
      editable: true,
    },
    {
      field: 'billableHours',
      headerName: 'Billable Hours',
      flex: 0.4,
      editable: true,
    },
    {
      field: 'hoursBilled',
      headerName: 'Billed Hours',
      flex: 0.4,
      editable: true,
    },
    {
      field: 'minutesBilled',
      headerName: 'Billed Minutes',
      flex: 0.4,
      editable: true,
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      flex: 0.6,
      editable: true,
    },
    {
      field: 'marketPlaceName',
      headerName: 'Market Place Name',
      flex: 1,
      editable: true,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 0.6,
      editable: true,
      renderCell: (params) => {
        return params.row.startDate ? moment(params.row.startDate).format('MM-DD-YYYY') : '';
      },
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 0.6,
      editable: true,
      renderCell: (params) => {
        return params.row.endDate ? moment(params.row.endDate).format('MM-DD-YYYY') : '';
      },
    },
    // {
    //   renderCell: (rowData: any) => {
    //     return rowData.row.isActive ? 'Active' : 'Inactive';
    //   },
    //   field: 'isActive',
    //   headerName: 'Status',
    //   flex: 0.4,
    //   editable: true,
    // },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Department',
      sortable: false,
      hide: !isInRole,
      flex: 0.4,

      renderCell: (param: any) => {
        const onClickDelProject = (): void => {
          const projectId = param.row.billingId;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the Project status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await projectBillingService.deleteProjectBilling(projectId);
              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(projectBillingService.fetchProjectBillingList());
            }
          });
        };

        const onClickEditProject = (): void => {
          setIsOpenEditModal(true);
          setEditRow(param.row);
        };

        if (isInRole) {
          return (
            <>
              <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditProject()}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" ria-label="delete" size="medium" onClick={() => onClickDelProject()}>
                <DeleteIcon />
              </IconButton>
            </>
          );
        }
        return <div>{/* if needed anything */}</div>;
      },
    },
  ];
  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    const deptFilter = dept === 'all' ? null : dept;
    dispatch(projectBillingService.fetchProjectBillingList(undefined, undefined, deptFilter));
  };

  return (
    <div>
      <>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={6} className={classes.header}>
            {isInRole && <DepartmentSelect value={selectedDept} onChange={onChangeDept} label="Department" />}
          </Grid>
          {isInRole ? (
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end', columnGap: 10 }}>
              <PrimaryButton startIcon={<GridArrowUpwardIcon />} onClick={() => refFile?.current.click()}>
                {' '}
                <input
                  ref={refFile}
                  id="file"
                  type="file"
                  hidden
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={(e) => {
                    handleFileChange(e);
                  }}
                />{' '}
                Upload File
              </PrimaryButton>
              <PrimaryButton startIcon={<GridAddIcon />} onClick={handelDownload}>
                Download Sample Project Excel
              </PrimaryButton>
              <DialogModel
                open={isOpen}
                title="Add Project Billing"
                dialogContent={<AddProjectBllingModal handleCloseDialog={handleCloseDialog} isOpen={isOpen} />}
              />
              <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
                Add Project Billing
              </SecondayButton>
            </Grid>
          ) : (
            ''
          )}

          <Grid item xs={12}>
            {loading ? (
              <img className={classes.loader} src={loadingImg} alt="loding-img" />
            ) : (
              <>
                {billingData && billingData !== null && (
                  <CustomDataGrid
                    rows={billingData || []}
                    columns={columns}
                    getRowId={(row) => row?.billingId}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>
      </>
      {isOpenEditModal && (
        <DialogModel
          open={isOpenEditModal}
          title="Edit client"
          dialogContent={
            <EditProjectBillingModal
              data={editRow}
              selectedDept={selectedDept}
              handleCloseDialog={handleCloseDialog}
              isOpen={isOpenEditModal}
            />
          }
        />
      )}
    </div>
  );
}
