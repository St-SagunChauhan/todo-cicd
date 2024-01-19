import React, { useState } from 'react';
import { Box, Paper, Button, Grid, FormControl, Select, MenuItem } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid';
import DialogModel from 'common/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { empSalarySelector, isLoadingSelector } from 'selectors/empSalary.selector';
import { deptSelector } from 'selectors/dept.selector';
import deptService from 'services/dept.Request';
import { IDept } from 'features/Department/DeptModel';
import Swal from 'sweetalert2';
import empSalaryService from 'services/empSalary.Request';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { roleSelector } from 'selectors/auth.selector';
import { USER_ROLE } from 'configs';
import loadingImg from '../../assets/images/blue_loading.gif';
import AddEmployeeSalary from './AddEmployeeSalary';
import UpdateEmployeeSalary from './EditEmployeeSalary';
import { IEmployee } from './EmpModel';
import { useEmpStyles } from './emp.styles';

export default function EmployeeSalaryList() {
  const dispatch = useDispatch();
  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [emp, setEmp] = useState<IEmployee>();
  const [selectedDept, setSelectedDept] = useState('all');
  const empSalaryData = useSelector(empSalarySelector);
  const deptData = useSelector(deptSelector);
  useSelector(isLoadingSelector);

  const loading: boolean = useSelector(isLoadingSelector);
  const classes = useEmpStyles();

  React.useEffect(() => {
    if (empSalaryData === null) {
      const salaryDept: string | null = localStorage.getItem('salaryDept');
      dispatch(empSalaryService.fetchEmpSalaryList(salaryDept === '' ? null : salaryDept));
      dispatch(deptService.fetchDepartmentList());
      localStorage.setItem('salaryDept', '');
    } else {
      const rows = empSalaryData.map((emp: any, index: number) => ({
        id: index,
        salaryId: emp.salaryId,
        employeeId: emp.employeeId,
        employeeNumber: emp.employeeNumber,
        bankName: emp.bankName,
        accountNumber: emp.accountNumber,
        ifscCode: emp.ifscCode,
        basicSalary: emp.basicSalary,
        firstName: emp.firstName,
        lastName: emp.lastName,
        bonus: emp.bonus,
        da: emp.da,
        hra: emp.hra,
        address: emp.address,
        learningAllowance: emp.learningAllowance,
        uniformAllowance: emp.uniformAllowance,
        conveyanceAllowance: emp.conveyanceAllowance,
        projectLevelBonus: emp.projectLevelBonus,
        grossSalary: emp.grossSalary,
        epfApplicable: emp.epfApplicable,
        esiApplicable: emp.esiApplicable,
        uanNo: emp.uanNo,
        esiNo: emp.esiNo,
      }));
      setRowData(rows);
    }
  }, [dispatch, empSalaryData]);

  const handleOpenEmployee = () => {
    setIsOpenEmployee(true);
  };
  const handleCloseEmployee = () => {
    setIsOpenEmployee(false);
    setIsOpenEdit(false);
  };

  const role = useSelector(roleSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;

  const columns: GridColDef[] = [
    {
      field: 'employeeNumber',
      headerName: 'Employee Number',
      minWidth: 200,
    },
    {
      field: 'firstName',
      headerName: 'Employee Name',
      minWidth: 200,
      editable: true,
      renderCell: (param: any) => {
        return `${param.row.firstName} ${param.row.lastName}`;
      },
    },
    {
      field: 'bankName',
      headerName: 'Bank Name',
      minWidth: 200,
    },
    {
      field: 'accountNumber',
      headerName: 'Account Number',
      minWidth: 210,
    },
    {
      field: 'ifscCode',
      headerName: 'Ifsc Code',
      minWidth: 200,
    },
    {
      field: 'basicSalary',
      headerName: 'Basic Salary',
      minWidth: 170,
      editable: true,
    },
    {
      field: 'bonus',
      headerName: 'Bonus',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'da',
      headerName: 'Da',
      minWidth: 100,
      editable: true,
    },
    {
      field: 'hra',
      headerName: 'Hra',
      minWidth: 100,
      editable: true,
    },
    {
      field: 'learningAllowance',
      headerName: 'Learning Allowance',
      minWidth: 200,
      editable: true,
    },
    {
      field: 'uniformAllowance',
      headerName: 'Uniform Allowance',
      minWidth: 200,
      editable: true,
    },
    {
      field: 'conveyanceAllowance',
      headerName: 'Conveyance Allowance',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'projectLevelBonus',
      headerName: 'Project Level Bonus',
      minWidth: 250,
      editable: true,
    },
    {
      field: 'grossSalary',
      headerName: 'Gross Salary',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'epfApplicable',
      headerName: 'Epf Applicable',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'esiApplicable',
      headerName: 'Esi Applicable',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'uanNo',
      headerName: 'Uan No',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'esiNo',
      headerName: 'Esi No',
      minWidth: 250,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Department',
      sortable: true,
      minWidth: 210,
      hide: !isInRole,
      renderCell: (employee: any) => {
        const onClickDelEmp = (): void => {
          const empId = employee.row.salaryId;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the employee salary status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await empSalaryService.deleteEmployeeSalary(empId);

              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(empSalaryService.fetchEmpSalaryList());
            }
          });
        };
        const onClickEdit = async (): Promise<void> => {
          const response = await empSalaryService.fetchEmpSalaryById(employee?.row.salaryId);

          setIsOpenEdit(true);
          setEmp(response?.data.employeeSalaries);
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
    dispatch(empSalaryService.fetchEmpSalaryList(deptFilter));
  };

  return (
    <div>
      <Grid container>
        {isInRole ? (
          <Grid item xs={3}>
            <h3 style={{ marginBottom: '5px' }}> Department</h3>
            <FormControl style={{ minWidth: 300, height: 50 }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label=""
                name="department"
                onChange={onChangeDept}
                value={selectedDept}
                MenuProps={{
                  style: {
                    maxHeight: 200,
                  },
                }}
              >
                <MenuItem value="all" key="all">
                  ALL
                </MenuItem>
                {deptData &&
                  deptData.length &&
                  deptData?.map((dept: IDept, key: number) => {
                    return (
                      <MenuItem value={dept.departmentId || undefined} key={key}>
                        {dept.departmentName}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          ''
        )}
        <Grid item xs={12}>
          <Paper>
            <Box m={2}>
              <Grid container alignItems="center">
                <Grid item sm={8}>
                  <h2>Employee Salary List</h2>
                </Grid>
                {isInRole ? (
                  <Grid container item sm={4} justifyContent="flex-end">
                    <div>
                      <DialogModel
                        open={isOpenEmployee}
                        title="Add client"
                        dialogContent={<AddEmployeeSalary handleClose={handleCloseEmployee} isOpenEmployee={isOpenEmployee} />}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<GridAddIcon />}
                        onClick={() => handleOpenEmployee()}
                      >
                        Add Employee salary
                      </Button>
                    </div>
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
              {loading ? (
                <img className={classes.loader} src={loadingImg} alt="loding-img" />
              ) : (
                <>
                  {rowData && rowData !== null && (
                    <Grid container spacing={2}>
                      <Box style={{ height: 600, width: '100%', margin: 2, marginBottom: 4 }}>
                        <DataGrid
                          rows={rowData}
                          columns={columns}
                          pageSize={10}
                          rowsPerPageOptions={[10]}
                          checkboxSelection={false}
                          disableSelectionOnClick
                          experimentalFeatures={{ newEditingApi: true }}
                        />
                      </Box>
                    </Grid>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <DialogModel
        open={isOpenEdit}
        title="Edit Employee"
        dialogContent={
          isOpenEdit && <UpdateEmployeeSalary isOpenEdit={isOpenEdit} employee={emp} handleCloseEdit={handleCloseEmployee} />
        }
      />
    </div>
  );
}
