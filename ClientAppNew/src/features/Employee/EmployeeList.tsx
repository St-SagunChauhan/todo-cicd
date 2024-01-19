import React, { useState, useRef } from 'react';
import {
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  InputLabel,
  DialogContent,
} from '@material-ui/core';
import {
  GridAddIcon,
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCheckCircleIcon,
  GridCloseIcon,
  GridColDef,
} from '@mui/x-data-grid';
import DialogModel from 'common/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { empSelector, isLoadingSelector } from 'selectors/emp.selector';
import Swal from 'sweetalert2';
import empService from 'services/emp.Request';
import IconButton from '@material-ui/core/IconButton';
import { IoWarning } from 'react-icons/io5';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PATH_NAME, USER_ROLE } from 'configs';
import { roleSelector } from 'selectors/auth.selector';
import deptService from 'services/dept.Request';
import { useHistory } from 'react-router';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import CustomDialog from 'components/molecules/CustomDialog/CustomDialog';
import { ExportEmployee } from 'features/ExcelExport/EmployeeExport';
import { setLoading } from 'actions/app.action';
import { FaArrowUp, FaUps } from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import AddEmployee from './AddEmployee';
import UpdateEmployee from './EditEmployee';
import { IEmployee } from './EmpModel';
import DeleteEmployee from './DeleteEmployee';
import { useEmpStyles } from './emp.styles';
import authService from '../../services/authService';
import profileImg from '../../assets/images/Profile.png';

export default function EmployeeList() {
  const refFile = useRef<any>();
  const dispatch = useDispatch();
  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [emp, setEmp] = useState<IEmployee>();
  const empData = useSelector(empSelector);
  const role = useSelector(roleSelector);
  const history = useHistory();

  useSelector(isLoadingSelector);

  const [selectedDept, setSelectedDept] = useState('all');
  const [impersonateUser, setImpersonateUser] = useState<any>(false);
  const [selectUser, setSelectUser] = useState(null);
  const loading: boolean = useSelector(isLoadingSelector);
  const classes = useEmpStyles();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [impersonationSuccess, setImpersonationSuccess] = useState(false);

  const isPersonating = localStorage.getItem('impersonating');

  const handleImpersonate = (employee: any) => {
    console.log(employee);
    setImpersonateUser(employee);
  };

  const handleConfirmationClose = () => {
    setImpersonateUser(null);
  };
  const handleimpersonateUser = () => {
    setImpersonateUser(true);
  };
  const handleConfirmationProceed = async () => {
    if (!selectUser) return;
    try {
      console.log({ selectUser });
      setIsSuccessDialogOpen(false);
      const impersonator = JSON.parse(authService.getUser());
      const response = await empService.impersonateEmployee(selectUser, impersonator?.employeeId);
      authService.setSession('impersonator', impersonator?.employeeId);
      if (response.data.success) {
        console.log(response);
        authService.setSession('accessToken', response.data.api_token);
        authService.setSession('user', JSON.stringify(response.data.user));
        authService.setSession('role', response.data.user.role);
        authService.setSession('impersonating', 'true');

        if (authService.getRole() === 'TeamLead') {
          history.push(PATH_NAME.ROOT);
        } else if (authService.getRole() === 'Admin') {
          history.push(PATH_NAME.MASTER_REPORT);
        } else if (authService.getRole() === 'HR') {
          history.push(PATH_NAME.EMPLOYEE);
        } else {
          history.push(PATH_NAME.PROFILE);
        }
        window.location.reload();
      } else {
        history.push(PATH_NAME.LOGIN);
        Swal.fire('Error', response.data.message, 'error');
      }
      setEmp(response.data.employeeModel);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (empData === null) {
      // const salaryDept: string | null = localStorage.getItem('salaryDept');
      const deptFilter = selectedDept === 'all' ? null : selectedDept;
      dispatch(empService.fetchEmpList(deptFilter || null));
      dispatch(deptService.fetchDepartmentList());
      localStorage.setItem('salaryDept', '');
    } else {
      const rows = empData.map((emp: any, index: number) => ({
        id: index,
        employeeId: emp.employeeId,
        employeeNumber: emp.employeeNumber,
        firstName: emp.firstName,
        lastName: emp.lastName,
        mobileNo: emp.mobileNo,
        role: emp.role,
        email: emp.email,
        address: emp.address,
        department: emp.departmentId,
        // password: emp.password,
        gender: emp.gender,
        profilePicture: emp.profilePicture === '' ? profileImg : `data:image/png;base64, ${emp.profilePicture}`,
        joiningDate: `${new Date(emp.joiningDate).getDate()}-${new Date(emp.joiningDate).getMonth() + 1}-${new Date(
          emp.joiningDate,
        ).getFullYear()}`,
        empStatus: emp.isActive ? 'Active' : 'InActive',
        employeeTargetedHours: emp.employeeTargetedHours,
        casualLeaves: emp.casualLeaves,
        sickLeaves: emp.sickLeaves,
      }));
      setRowData(rows);
    }
  }, [dispatch, empData]);

  function getFullName(params: any) {
    return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
  }

  const handleOpenEmployee = () => {
    setIsOpenEmployee(true);
  };
  const handleCloseEmployee = () => {
    setIsOpenEmployee(false);
    setIsOpenEdit(false);
    setIsOpenDelete(false);
  };

  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;

  const columns: GridColDef[] = [
    {
      field: 'profilePicture',
      headerName: 'Profile',
      maxWidth: 70,
      editable: false,
      renderCell: (params) => (
        <img alt="Profile Picture" style={{ width: '50px', height: '50px', borderRadius: '50%' }} src={params.value} />
      ),
    },
    {
      field: 'employeeNumber',
      headerName: 'Employee Number',
      minWidth: 210,
      editable: true,
    },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   minWidth: 210,
    //   valueGetter: getFullName,
    // },
    {
      field: 'firstName',
      headerName: 'First Name',
      minWidth: 200,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      minWidth: 200,
      editable: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      minWidth: 200,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 300,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'mobileNo',
      headerName: 'Mobile No',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'joiningDate',
      headerName: 'Joining Date',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'employeeTargetedHours',
      headerName: 'Employee Targeted Hours',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'casualLeaves',
      headerName: 'Casual Leaves',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'sickLeaves',
      headerName: 'Sick Leaves',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Department',
      sortable: true,
      minWidth: 210,
      align: 'center',
      hide: !isInRole,
      renderCell: (employee: any) => {
        const onClickDelEmp = (): void => {
          const empId = employee.row.employeeId;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the employee status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await empService.deleteEmployee(empId);
              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }
            }
            dispatch(empService.fetchEmpList());
          });
        };

        const onClickEdit = async (): Promise<void> => {
          const response = await empService.fetchEmpById(employee?.row.employeeId);

          setIsOpenEdit(true);
          setEmp(response?.data.employeeModel);
        };
        const onClickChangePassword = async (): Promise<void> => {
          const response = await empService.fetchEmpById(employee?.row.employeeId);
          setEmp(response?.data.employeeModel);
        };

        if (isInRole) {
          return (
            <div>
              <IconButton color="primary" aria-label="edit" size="medium" onClick={onClickEdit}>
                <EditIcon />
              </IconButton>
              <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelEmp()}>
                <DeleteIcon />
              </IconButton>
            </div>
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
    localStorage.setItem('salaryDept', dept);
    dispatch(empService.fetchEmpList(deptFilter));
  };

  const handleSelection = (e: any) => {
    setSelectUser(e.target.value);
  };

  const btnRole = authService.getRole();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await empService.ImportEmployee(e.target.files);
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
    }
    dispatch(empService.fetchEmpList());
    setLoading(false);
    e.target.value = '';
  };

  const employeeOptions =
    empData &&
    empData.length &&
    empData?.map((employee: IEmployee, key: number) => ({ label: employee.firstName, value: employee.employeeId }));

  const handelDownload = async () => {
    try {
      await empService.downloadEmployeeSampleExcel();
    } catch (error) {
      throw Error();
    }
  };

  return (
    <div>
      <Grid container style={{ marginBottom: '10px' }}>
        {isInRole ? (
          <Grid item xs={4}>
            <Box sx={{ width: '15%' }}>
              <DepartmentSelect value={selectedDept} onChange={onChangeDept} />
            </Box>
          </Grid>
        ) : (
          ''
        )}
        <Grid item xs={!isInRole ? 4 : 8} style={{ display: 'flex', justifyContent: 'end' }}>
          {isInRole ? (
            <div style={{ display: 'flex', alignItems: 'end', columnGap: 10 }}>
              <DialogModel
                open={isOpenEmployee}
                title="Add Employee"
                dialogContent={
                  <AddEmployee handleClose={handleCloseEmployee} isOpenEmployee={isOpenEmployee} empData={empData} />
                }
              />
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
                Download Employees Sample Excel
              </PrimaryButton>
              {btnRole === USER_ROLE.ADMIN ? (
                <PrimaryButton onClick={() => handleimpersonateUser()} style={{ marginRight: '10px' }}>
                  <span>
                    <FaPerson style={{ fontSize: '20px', transform: 'translate(-5px, 3px)' }} />
                  </span>
                  Impersonate User
                </PrimaryButton>
              ) : (
                ''
              )}
              <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpenEmployee()}>
                Add Employee
              </SecondayButton>
            </div>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
      {rowData && rowData !== null && (
        <CustomDataGrid
          rows={rowData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      )}

      <DialogModel
        open={isOpenEdit}
        title="Edit Employee"
        dialogContent={
          isOpenEdit && (
            <UpdateEmployee
              isOpenEdit={isOpenEdit}
              selectedDept={selectedDept}
              employee={emp}
              handleCloseEdit={handleCloseEmployee}
            />
          )
        }
      />

      <DialogModel
        open={isOpenDelete}
        title="Delete Employee"
        dialogContent={
          <DeleteEmployee setIsOpenDelete={setIsOpenDelete} employee={emp} handleCloseDelete={handleCloseEmployee} />
        }
      />

      <CustomDialog
        title="Impersonate Employee"
        open={!!impersonateUser}
        onClose={handleConfirmationClose}
        content={
          <CustomSelect
            showAll={false}
            label="Employee"
            options={employeeOptions || []}
            value={emp?.employeeId || ''}
            onChange={handleSelection}
          />
        }
        actions={
          <>
            <PrimaryButton startIcon={<IoWarning />} onClick={handleConfirmationProceed} disabled={!selectUser} autoFocus>
              Proceed
            </PrimaryButton>
            <SecondayButton startIcon={<GridCloseIcon />} onClick={handleConfirmationClose}>
              Close
            </SecondayButton>
          </>
        }
      />

      {/* <DialogModel
        open={isOpen}
        title="Change Password"
        dialogContent={isOpen && <ChangePassword handleClose={handleClose} isOpen={isOpen} user={emp} />}
      /> */}
    </div>
  );
}
