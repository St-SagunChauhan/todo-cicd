import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Button, FormControl, Select, MenuItem } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid/index';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import { isLoadingSelector, projectSelector } from 'selectors/project.selector';
import { roleSelector } from 'selectors/auth.selector';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import { ContractTypeEnum } from 'Enums/ProjectEnum/ProjectEnum';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import DialogModel from 'common/Dialog';
import { USER_ROLE } from 'configs';
import { deptSelector } from 'selectors/dept.selector';
import { setLoading } from 'actions/app.action';
import moment from 'moment';
import loadingImg from '../../assets/images/blue_loading.gif';
import projectService from '../../services/project.Requets';
import AddProjectModal from './AddProjectModal';
import EditDeptModel from './EditProjectModel';
import useClientStyles from './project.style';

export default function ProjectList() {
  const refFile = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [editRow, setEditRow] = useState(null);
  const [contractList, setContractList] = useState<any>([]);
  const [selectedContract, setSelectedContract] = useState('all');
  const dispatch = useDispatch();
  const projectData = useSelector(projectSelector);
  const loading = useSelector(isLoadingSelector);

  const classes = useClientStyles();
  const role = useSelector(roleSelector);

  const [selectedDept, setSelectedDept] = useState('all');
  const deptData = useSelector(deptSelector);

  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;
  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  React.useEffect(() => {
    const deptFilter = selectedDept === 'all' ? null : selectedDept;
    dispatch(projectService.fetchProjectList(deptFilter || null));
  }, [dispatch]);

  function renderCommaSeparatedCell(params: any) {
    // Assuming the 'values' field is an array
    const values = params.departmentName;
    if (Array.isArray(values)) {
      return <span>{values.join(', ')}</span>;
    }
    return null;
  }

  const columns: GridColDef[] = [
    { field: 'accounts', headerName: 'Accounts', width: 140, editable: true },
    { field: 'upworkName', headerName: 'UpWorkId', width: 200, editable: true },
    {
      field: 'contractName',
      headerName: 'ContractName',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'clientName',
      headerName: 'Client Name',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'departments',
      headerName: 'Department Name',
      minWidth: 310,
      editable: true,
      renderCell: (param: any) => renderCommaSeparatedCell(param.row),
    },
    {
      field: 'employees',
      headerName: 'EmployeesName',
      minWidth: 300,
      editable: true,
      // renderCell: (param: any) => {
      //   return `${param.row.firstName} ${param.row.lastName}`;
      // },
    },
    {
      field: 'hoursPerWeek',
      headerName: 'Weekly Hours',
      minWidth: 110,
      editable: true,
    },
    {
      field: 'contractType',
      headerName: 'ContractType',
      minWidth: 130,
      editable: true,
    },
    {
      field: 'billingStatus',
      headerName: 'ContractStatus',
      minWidth: 130,
      editable: true,
    },
    {
      field: 'communicationMode',
      headerName: 'CommunicationMode',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'startDate',
      headerName: 'startDate',
      minWidth: 130,
      editable: true,
      renderCell: (param: any) => {
        if (param?.row.startDate) {
          return moment(param?.row.startDate).format('MM-DD-YYYY');
        }
        return '';
      },
    },
    {
      field: 'billingType',
      headerName: 'BillingType',
      minWidth: 180,
      editable: true,
    },
    {
      field: 'country',
      headerName: 'Country',
      minWidth: 120,
      editable: true,
      renderCell: (rowData: any) => {
        return rowData.row.country;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      editable: true,
      renderCell: (rowData: any) => {
        return rowData.row.status;
      },
    },
    {
      field: 'endDate',
      headerName: 'EndDate',
      minWidth: 130,
      editable: true,
      renderCell: (param: any) => {
        if (param?.row.endDate) {
          return moment(param?.row.endDate).format('MM-DD-YYYY');
        }
        return '';
      },
    },
    {
      field: 'projectReview',
      headerName: 'ProjectReview',
      minWidth: 150,
      editable: true,
      renderCell: (rowData: any) => {
        return rowData.row.projectReview;
      },
    },
    {
      field: 'projectUrl',
      headerName: 'ProjectUrl',
      minWidth: 160,
      editable: true,
      renderCell: (rowData: any) => {
        return rowData.row.projectUrl;
      },
    },
    {
      field: 'rating',
      headerName: 'Rating',
      minWidth: 80,
      editable: true,
      renderCell: (rowData: any) => {
        return rowData.row.rating;
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Project',
      sortable: false,
      minWidth: 100,
      hide: !isInRole,
      renderCell: (param: any) => {
        console.log(param);

        const onClickDelProject = (): void => {
          const { id } = param.row;
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
              const response = await projectService.deleteProject(id);

              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(projectService.fetchProjectList());
            }
          });
        };

        const onClickEditProject = async (): Promise<void> => {
          const response = await projectService.getProject(param?.row.id);

          console.log('true', param?.row.id);
          setIsOpenEditModal(true);
          setEditRow(response?.project);
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
    const dept = e?.target?.value;
    if (dept) {
      const deptFilter = dept === 'all' ? null : dept;
      dispatch(
        projectService.fetchProjectList(deptFilter, null, null, null, selectedContract === 'all' ? null : selectedContract),
      );
      localStorage.setItem('salaryDept', dept);
      setSelectedDept(dept);
    }
  };
  const handelDownload = async () => {
    try {
      await projectService.exportProject();
    } catch (error) {
      throw Error();
    }
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenEditModal(false);
    setIsOpenDelete(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFileList(e.target.files);
    setLoading(true);
    const response = await projectService.ImportProject(e.target.files);
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
      dispatch(projectService.fetchProjectList());
      setLoading(false);
      e.target.value = '';
    }
  };

  const onContractChange = (e: any) => {
    const cont = e?.target?.value;
    if (cont) {
      const contFilter = cont === 'all' ? null : cont;
      dispatch(projectService.fetchProjectList(selectedDept === 'all' ? null : selectedDept, null, null, null, contFilter));
      setSelectedContract(cont);
    }
  };

  useEffect(() => {
    const myArray: { label: string; value: string }[] = [];
    const contractData = Object.entries(ContractTypeEnum).map(([key, val]) => ({
      label: val,
      value: key,
    }));
    const completedLabel = { label: 'Completed', value: 'Completed' };
    myArray.push(...contractData);
    setContractList(myArray);
  }, []);

  console.log(contractList);

  return (
    <Grid container spacing={2}>
      <Grid item xs={2} className={classes.header}>
        {isInRole && (
          <CustomSelect label="Contract type" value={selectedContract} onChange={onContractChange} options={contractList} />
        )}
      </Grid>
      <Grid item xs={3} className={classes.header}>
        {isInRole && <DepartmentSelect value={selectedDept} onChange={onChangeDept} label="Department" />}
      </Grid>
      {isInRole ? (
        <Grid item xs={7} style={{ display: 'flex', justifyContent: 'end', columnGap: 10 }}>
          <PrimaryButton startIcon={<GridArrowUpwardIcon />} onClick={() => refFile?.current.click()}>
            <input
              ref={refFile}
              id="file"
              type="file"
              hidden
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
            Upload File
          </PrimaryButton>
          {/* <ExportProject userDetail={projectData} Dynamiccolumn={columns} /> */}
          <PrimaryButton startIcon={<GridAddIcon />} onClick={handelDownload}>
            Download Sample Project Excel
          </PrimaryButton>

          <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
            Add Project
          </SecondayButton>
          <DialogModel
            open={isOpen}
            title="Add Project"
            dialogContent={<AddProjectModal handleCloseDialog={handleClose} isOpen={isOpen} />}
          />
        </Grid>
      ) : (
        ''
      )}
      <Grid item xs={12}>
        {loading ? (
          <img className={classes.loader} src={loadingImg} alt="loding-img" />
        ) : (
          <>
            {projectData && projectData !== null && (
              <CustomDataGrid rows={projectData || []} columns={columns} getRowId={(row) => row?.id} loading={loading} />
            )}
          </>
        )}
      </Grid>
      <DialogModel
        open={isOpenEditModal}
        title="Edit Project"
        dialogContent={
          <EditDeptModel
            isOpen={isOpenEditModal}
            data={editRow}
            selectedDept={selectedDept}
            handleCloseDialog={handleCloseDialog}
          />
        }
      />
    </Grid>
  );
}
