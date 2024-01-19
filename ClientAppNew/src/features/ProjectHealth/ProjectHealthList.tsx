import React, { useState } from 'react';
import { Box, Grid, Button, FormControl, Select, MenuItem } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid/index';
import { TbThumbUp } from 'react-icons/tb';
import { IoWarningOutline } from 'react-icons/io5';
import { MdOutlineDangerous } from 'react-icons/md';
import Paper from '@material-ui/core/Paper';
import projectHealthService from 'services/projectHealth.Request';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import DialogModel from 'common/Dialog';
import { projectHealthSelector, isLoadingSelector } from 'selectors/projectHealth.selector';
import { roleSelector } from 'selectors/auth.selector';
import { USER_ROLE } from 'configs';
import { deptSelector } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
import CustomizedBreadcrumbs from 'components/molecules/CustomizedBreadcrumbs/CustomizedBreadcrumbs';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import AddProjectHealthModal from './AddProjectHealthModal';
import EditProjectHealthModal from './EditProjectHealthModal';
import { projectHealthStyle } from './ProjectHealth.style';
import loadingImg from '../../assets/images/blue_loading.gif';

export default function ProjectHealthList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const dispatch = useDispatch();
  const projectHealth = useSelector(projectHealthSelector);
  const classes = projectHealthStyle();
  useSelector(isLoadingSelector);
  const loading: any = useSelector(isLoadingSelector);
  const role = useSelector(roleSelector);

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
    dispatch(projectHealthService.fetchProjectHealthList(deptFilter || null));
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'projectHealthRate',
      headerName: 'Health',
      maxWidth: 80,
      flex: 0.5,
      editable: true,
      renderCell: (param: any) => {
        if (param.row.projectHealthRate === 'Green') {
          return (
            <Box
              style={{
                backgroundColor: '#35ad58',
                width: '50px',
                height: '50px',
                textAlign: 'center',
                color: '#ffffff',
                fontWeight: 'bold',
                paddingTop: '15px',
                borderRadius: '50px',
              }}
            >
              {/* {param.row.projectHealthRate} */}
              <TbThumbUp style={{ fontSize: '26px', transform: 'translate(0px, -5px)' }} />
            </Box>
          );
        }
        if (param.row.projectHealthRate === 'Yellow') {
          return (
            <Box
              style={{
                backgroundColor: '#e0d312',
                width: '50px',
                height: '50px',
                textAlign: 'center',
                color: '#ffffff',
                fontWeight: 'bold',
                paddingTop: '15px',
                borderRadius: '50px',
              }}
            >
              {/* {param.row.projectHealthRate} */}
              <IoWarningOutline style={{ fontSize: '26px', transform: 'translate(0px, -5px)' }} />
            </Box>
          );
        }
        if (param.row.projectHealthRate === 'Red') {
          return (
            <Box
              style={{
                backgroundColor: '#ec0e0e',
                width: '50px',
                height: '50px',
                textAlign: 'center',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* {param.row.projectHealthRate} */}
              <MdOutlineDangerous style={{ fontSize: '30px', transform: 'translate(0px, 0px)' }} />
            </Box>
          );
        }
        return null;
      },
    },
    {
      field: 'contractName',
      headerName: 'Project Name',
      flex: 0.5,
      editable: true,
      renderCell: (param: any) => {
        return param.row.projects.contractName;
      },
    },
    {
      field: 'clientName',
      headerName: 'Client Name',
      flex: 0.5,
      editable: true,
      renderCell: (param: any) => {
        return `${param.row.clients.clientName}`;
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.3,
      editable: true,
      renderCell: (param: any) => {
        return moment(param?.row.date).format('MM-DD-YYYY');
      },
    },
    {
      field: 'comments',
      headerName: 'Comments',
      flex: 1,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Projec Health',
      sortable: false,
      flex: 0.4,
      hide: !isInRole,
      renderCell: (param: any) => {
        const onClickDelProject = (): void => {
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
              const response = await projectHealthService.deleteProjectHealth(param.row.id);

              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(projectHealthService.fetchProjectHealthList());
            }
          });
        };

        const onClickEditProject = async (): Promise<void> => {
          const response = await projectHealthService.fetchProjectHealthById(param?.row.id);

          setIsOpenEditModal(true);
          setEditRow(response?.data.projectHealth);
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
    dispatch(projectHealthService.fetchProjectHealthList(deptFilter));
  };

  return (
    <div>
      <>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={6} className={classes.header}>
            {isInRole && <DepartmentSelect value={selectedDept} onChange={onChangeDept} label="Department" />}
          </Grid>
          {isInRole ? (
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
              <DialogModel
                open={isOpen}
                title="Add Project Health"
                dialogContent={<AddProjectHealthModal handleCloseDialog={handleCloseDialog} isOpen={isOpen} />}
              />
              <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
                Add Project Health
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
                {projectHealth && projectHealth !== null && (
                  <CustomDataGrid rows={projectHealth || []} columns={columns} getRowId={(row) => row?.id} loading={loading} />
                )}
              </>
            )}
          </Grid>
        </Grid>

        <AddProjectHealthModal isOpen={isOpen} handleCloseDialog={handleCloseDialog} />
        {isOpenEditModal && editRow && (
          <DialogModel
            open={isOpenEditModal}
            title="Edit client"
            dialogContent={
              <EditProjectHealthModal
                data={editRow}
                selectedDept={selectedDept}
                handleCloseDialog={handleCloseDialog}
                isOpen={isOpenEditModal}
              />
            }
          />
        )}
      </>
    </div>
  );
}
