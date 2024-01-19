import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, TextField, FormControl, Select, MenuItem } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid/index';
import Paper from '@material-ui/core/Paper';
import leaveService from 'services/leave.Request';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import DialogModel from 'common/Dialog';
import { leaveSelector, isLoadingSelector as isLoadingLeave } from 'selectors/leave.selector';
import { USER_ROLE } from 'configs';
import { deptSelector } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
import { roleSelector } from 'selectors/auth.selector';
import { empSelector, isLoadingSelector as isLoadingEmp } from 'selectors/emp.selector';
import { IEmployee } from 'features/Employee/EmpModel';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import empService from 'services/emp.Request';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import CustomAutocomplete from 'components/molecules/CustomAutoComplete/CustomAutoComplete';
import AddLeaveModal from './AddLeaveModal';
import EditLeaveModal from './EditLeaveModal';
import { leaveStyle } from './leave.style';
import loadingImg from '../../assets/images/blue_loading.gif';

export default function LeaveList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const dispatch = useDispatch();
  const leaveData = useSelector(leaveSelector);
  const classes = leaveStyle();
  const loadingEmp = useSelector(isLoadingEmp);
  useSelector(isLoadingLeave);
  const loading: any = useSelector(isLoadingLeave);
  const empData = useSelector(empSelector);
  const role = useSelector(roleSelector);
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedEmp, setSelectedEmp] = useState('all');
  const deptData = useSelector(deptSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;
  const [selectedLeaveStatus, setLeaveStatus] = useState<any>('');
  const [startDates, setStartDate] = useState('');
  const [endDates, setEndDate] = useState('');
  const [emp, setEmp] = useState<any[]>([]);
  const [dept, setDept] = useState<any[]>([]);

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    // dispatch(empService.fetchEmpList(null));
    const empList =
      empData && empData?.length > 0
        ? empData.map((emp: IEmployee) => ({ label: `${emp.firstName} ${emp.lastName}`, value: emp.employeeId }))
        : [{ label: 'No Employee Found', value: null }];
    setEmp(empList);
  }, [empData]);

  useEffect(() => {
    if (deptData !== null) {
      const deptList =
        deptData && deptData?.length > 0
          ? deptData.map((dept: any) => ({
              label: dept.departmentName,
              value: dept.departmentId,
            }))
          : [{ label: 'No Department Found', value: null }];
      setDept(deptList);
    }
  }, [deptData]);

  useEffect(() => {
    if (leaveData === null) {
      dispatch(leaveService.fetchLeaveList(null, null, null, null));
    }
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'Employee Name',
      minWidth: 250,
      editable: true,
      renderCell: (param: any) => {
        return `${param.row.firstName} ${param.row.lastName}`;
      },
    },
    {
      field: 'employeeNumber',
      headerName: 'Employee Number',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'leaveType',
      headerName: 'Leave Type',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 210,
      editable: true,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 210,
      editable: true,
      renderCell: (param: any) => {
        return moment(param?.row.startDate).format('MM-DD-YYYY');
      },
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 210,
      editable: true,
      renderCell: (param: any) => {
        if (param?.row.endDate) {
          return moment(param?.row.endDate).format('MM-DD-YYYY');
        }
        return '';
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      minWidth: 150,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Leaves',
      sortable: false,
      minWidth: 100,
      renderCell: (param: any) => {
        const onClickDelLeave = (): void => {
          const { id } = param.row;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the Leave status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await leaveService.deleteLeave(id);

              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(leaveService.fetchLeaveList());
            }
          });
        };

        const onClickEditLeave = async (): Promise<void> => {
          const response = await leaveService.fetchLeaveById(param?.row.id);

          setIsOpenEditModal(true);
          setEditRow(response?.data.leaveModel);
        };

        if (role === USER_ROLE.TEAMLEAD) {
          <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditLeave()}>
            <EditIcon />
          </IconButton>;
        }

        if (isInRole) {
          return (
            <>
              <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditLeave()}>
                <EditIcon />
              </IconButton>

              <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelLeave()}>
                <DeleteIcon />
              </IconButton>
            </>
          );
        }
        if (role === USER_ROLE.TEAMLEAD) {
          return (
            <div>
              <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditLeave()}>
                <EditIcon />
              </IconButton>
            </div>
          );
        }
        return <div>{/* if needed anything */}</div>;
      },
    },
  ];
  const onChangeDept = (e: any) => {
    const selectDept = e.target.value;

    if (selectDept === null) {
      const empList =
        empData && empData?.length > 0
          ? empData.map((emp: IEmployee) => ({ label: `${emp.firstName} ${emp.lastName}`, value: emp.employeeId }))
          : [{ label: 'No Employee Found', value: null }];
      setEmp(empList);
    } else {
      setSelectedDept(selectDept);
      const deptFilter = selectDept === 'all' ? null : selectDept;
      setSelectedEmp(selectDept);
      const emp1 = selectedEmp === 'all' ? null : selectedEmp;
      const SDate = startDates || null;
      const Edate = endDates || null;
      localStorage.setItem('salaryDept', selectDept);
      const selectedStatus = selectedLeaveStatus === 'all' ? null : selectedLeaveStatus;

      dispatch(leaveService.fetchLeaveList(Edate, SDate, deptFilter, emp1, selectedStatus));

      const empLi = empData.filter((item: any) => item.departmentId === deptFilter);
      const empList = empLi.map((data: any) => ({
        label: `${data.firstName} ${data.lastName}`,
        value: data.employeeId,
      }));
      setEmp(empList);
      console.log(2);
    }
    console.log(emp);
  };

  const onChangeEmp = (e: any) => {
    const employee = e.target.value;
    setSelectedEmp(employee);
    const SDate = startDates || null;
    const Edate = endDates || null;
    const empFilter = employee === 'all' ? null : employee;
    const selectedDepts = selectedDept === 'all' ? null : selectedDept;
    const selectedStatus = selectedLeaveStatus === 'all' ? null : selectedLeaveStatus;
    dispatch(leaveService.fetchLeaveList(Edate, SDate, selectedDepts, empFilter, selectedStatus));
  };

  const onChangeDate = (data: Record<string, string>) => {
    const empFilter = selectedEmp === 'all' ? null : selectedEmp;
    const selectedDepts = selectedDept === 'all' ? null : selectedDept;
    const selectedStatus = selectedLeaveStatus === 'all' ? null : selectedLeaveStatus;
    dispatch(leaveService.fetchLeaveList(data?.endDate, data?.startDate, selectedDepts, empFilter, selectedStatus));
  };

  const leaveStatusOptions = [
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Pending', value: 'Pending' },
  ];

  const onChangeLeaveStatus = (event: any) => {
    const leaveStatus = event.target.value;
    setLeaveStatus(leaveStatus);

    const SDate = startDates || null;
    const Edate = endDates || null;
    const empFilter = selectedEmp === 'all' ? null : selectedEmp;
    const selectedDepts = selectedDept === 'all' ? null : selectedDept;

    dispatch(leaveService.fetchLeaveList(SDate, Edate, empFilter, selectedDepts, leaveStatus));
  };

  return (
    <div>
      <>
        <Grid container spacing={2}>
          <Grid item xs={6} className={classes.header}>
            {isInRole && <DepartmentSelect value={selectedDept} onChange={onChangeDept} label="Department" />}
            <CustomSelect
              options={emp}
              value={selectedEmp}
              onChange={onChangeEmp}
              id="employee-select"
              loading={loadingEmp}
              label="Employee"
            />
            <CustomSelect
              options={leaveStatusOptions}
              value={selectedLeaveStatus}
              onChange={onChangeLeaveStatus}
              id="department-select"
              loading={loadingEmp}
              label="Leave Status"
            />
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
            <Box sx={{ marginTop: '8px', marginRight: '15px' }}>
              <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: endDates }} />
            </Box>
            <DialogModel
              open={isOpen}
              title="Add Leave"
              dialogContent={<AddLeaveModal handleCloseDialog={handleCloseDialog} isOpen={isOpen} />}
            />

            <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
              Add Leave
            </SecondayButton>
          </Grid>

          <Grid item xs={12}>
            {loading ? (
              <img className={classes.loader} src={loadingImg} alt="loding-img" />
            ) : (
              <>
                {leaveData && leaveData !== null && (
                  <CustomDataGrid rows={leaveData || []} columns={columns} getRowId={(row) => row?.id} loading={loading} />
                )}
              </>
            )}
          </Grid>
        </Grid>

        <AddLeaveModal isOpen={isOpen} handleCloseDialog={handleCloseDialog} />
        {isOpenEditModal && editRow && (
          <DialogModel
            open={isOpenEditModal}
            title="Edit client"
            dialogContent={
              <EditLeaveModal
                data={editRow}
                selectedDept={selectedDept}
                selectedEmp={selectedEmp}
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
