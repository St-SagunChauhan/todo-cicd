import React, { useState } from 'react';
import { DataGrid, GridAddIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid/index';
import { Box, FormControl, Grid, MenuItem, Paper, Select, TextField, FormLabel } from '@material-ui/core';
import { setLoading } from 'actions/app.action';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { useDispatch, useSelector } from 'react-redux';
import teamLoggerServices from 'services/teamLogger.Request';
import { ExportToExcel } from 'features/ExcelExport/excleDownload';
import { teamLoggerSelector, isLoadingSelector as isLoadingTeamSelector } from 'selectors/teamLogger.selector';
import { roleSelector } from 'selectors/auth.selector';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import { USER_ROLE } from 'configs';
import { deptSelector, isLoadingSelector as isLoadingDept } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
import Swal from 'sweetalert2';
import moment from 'moment';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import { DatePicker } from '@mui/x-date-pickers';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import { activeReportsStyle } from './ActiveReport.style';
import loadingImg from '../../assets/images/blue_loading.gif';

export default function TeamLogger() {
  const classes = activeReportsStyle();
  const [fileList, setFileList] = useState<FileList | null>(null);
  const dispatch = useDispatch();
  const role = useSelector(roleSelector);
  const loadingDept = useSelector(isLoadingDept);
  const [selectedDept, setSelectedDept] = useState('all');
  useSelector(isLoadingTeamSelector);
  const loading: any = useSelector(isLoadingTeamSelector);
  // const [teamLoggerData, setteamLoggerData] = useState();
  const deptData = useSelector(deptSelector);
  const teamLoggerData = useSelector(teamLoggerSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;
  const [startDates, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 180 },
    {
      field: 'department',
      headerName: 'Department',
      width: 250,
      editable: true,
    },
    {
      field: 'timer',
      headerName: 'Timer',
      width: 250,
      editable: true,
    },
    {
      field: 'manual',
      headerName: 'Manual',
      width: 250,
      editable: true,
    },
    {
      field: 'inactive',
      headerName: 'Inactive',
      width: 250,
      editable: true,
    },
    {
      field: 'startDay',
      headerName: 'Start Day',
      width: 250,
      editable: true,
    },
    {
      field: 'nextDay',
      headerName: 'Next Day',
      width: 250,
      editable: true,
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 250,
      editable: true,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
      editable: true,
    },
    {
      field: 'recordDate',
      headerName: 'Record Date',
      width: 200,
      editable: true,
      renderCell: (param: any) => {
        return moment(param?.row.connect_Date).format('YYYY-MM-DD');
      },
    },
  ];

  React.useEffect(() => {
    dispatch(teamLoggerServices.fetchFiltredData());
  }, []);

  const handelDownload = async () => {
    try {
      await teamLoggerServices.downloadTeamloggerSampleExcel();
    } catch (error) {
      throw Error();
    }
  };

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    dispatch(teamLoggerServices.fetchFiltredData(dept, startDates));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await teamLoggerServices.createTeamLoggerReport(e.target.files);
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
    dispatch(teamLoggerServices.fetchFiltredData());
    setLoading(false);
    e.target.value = '';
  };

  const onChangeStartDate = (e: any) => {
    const startDate = e.target.value;
    const dep = selectedDept === 'all' ? null : selectedDept;
    setStartDate(startDate);

    const dayOfWeek = 5;
    const date = new Date(startDate);
    const diff = date.getDay() - dayOfWeek;
    if (diff > 0) {
      date.setDate(date.getDate() + 6);
    } else if (diff < 0) {
      date.setDate(date.getDate() + -1 * diff);
    }
    console.log(date);
    dispatch(teamLoggerServices.fetchFiltredData(dep, startDate));
  };

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({ label: dep.departmentName, value: dep.departmentId }))
      : [];

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box className={classes.flexBox}>
            <Box className={classes.flexBox}>
              <FormLabel style={{ marginRight: '20px' }}>Department</FormLabel>
              <DepartmentSelect value={selectedDept} onChange={onChangeDept} id="department-select" />
            </Box>
          </Box>
          <Box className={classes.flexBox}>
            {/* <h3 style={{ marginBottom: '2px' }}> Date</h3> */}
            <TextField
              name="uploadDate"
              id="date"
              type="date"
              value={startDates || null}
              onChange={(e) => onChangeStartDate(e)}
              required
            />
          </Box>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
          {isInRole ? (
            <Box m={2} style={{ alignItems: 'center', display: 'flex', columnGap: 10 }}>
              <label
                htmlFor="actual-btn"
                style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '15px 20px',
                  fontFamily: 'sans-serif',
                  borderRadius: '0.3rem',
                  cursor: 'pointer',
                  marginLeft: '232px',
                  verticalAlign: 'unset',
                  display: 'inline',
                }}
              >
                <ArrowUpwardIcon style={{ fontSize: '1rem' }} />
                <input
                  type="file"
                  id="actual-btn"
                  onChange={handleFileChange}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  hidden
                />
                Upload Excel
              </label>
              {/* <ExportToExcel userDetail={teamLoggerData} Dynamiccolumn={columns} /> */}
              <PrimaryButton startIcon={<GridAddIcon />} onClick={handelDownload} style={{ marginTop: 0 }}>
                Download TeamLogger Sample Excel
              </PrimaryButton>
            </Box>
          ) : (
            ''
          )}
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <img className={classes.loader} src={loadingImg} alt="loding-img" />
          ) : (
            <>
              {teamLoggerData && teamLoggerData !== null && (
                <CustomDataGrid
                  rows={teamLoggerData || []}
                  columns={columns}
                  getRowId={(row) => row?.id}
                  loading={loading}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* <Paper>
        <Box m={2}>
          {teamLoggerData && teamLoggerData !== null && (
            <Grid container spacing={2}>
              <Box style={{ height: 600, width: '100%', margin: 2, marginBottom: 4 }}>
                <DataGrid
                  rows={teamLoggerData}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  getRowId={(row) => row.id}
                />
              </Box>
            </Grid>
          )}
        </Box>
      </Paper> */}
    </div>
  );
}
