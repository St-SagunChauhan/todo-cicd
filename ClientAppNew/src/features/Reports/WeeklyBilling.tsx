import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import deptService from 'services/dept.Request';
import weeklyBillingService from 'services/weeklyBilling.Request';
import { weeklyBillingSelector, isLoadingWeeklyBilling } from 'selectors/weeklyBilling.selector';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import moment from 'moment';
import { Button, Grid, FormLabel, FormControl, TextField, InputLabel } from '@material-ui/core';
import { IDept } from 'features/Department/DeptModel';
import { isLoadingSelector } from 'selectors/report.selector';
import { deptSelector, isLoadingSelector as isLoadingDept } from 'selectors/dept.selector';
import { GridArrowDownwardIcon, GridColDef, GridCloseIcon } from '@mui/x-data-grid';
import Chart from 'react-apexcharts';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { ApexOptions } from 'apexcharts';
import DialogModel from 'common/Dialog';
import { weeklyBillingReportStyle } from './WeeklyBillingReport.style';
import loadingImg from '../../assets/images/blue_loading.gif';
import ReportsRow from './ReportsRow';

interface RowData {
  departmentName: string;
  billedHours: number;
  totalHoursBilled: number;
  weeklyBillingHours: number;
  totalTragetedHours: number;
  totalWeeklyCapacity: number;
  billingSubReports: BillingSubReport[];
  startDate: string;
  endDate: string;
  targetedHours: number;
}

interface BillingSubReport {
  billingId: string;
  projectDepartmentId: string;
  projectName: number;
  clientName: string;
  billingType: string;
  accounts: string;
  upworkId: string;
  week: string;
  startDate: string;
  endDate: string;
  billableHours: number;
  hourBilled: number;
}

export default function CollapsibleTable() {
  const dispatch = useDispatch();
  const dateRef = useRef(false);
  const [show, setShow] = useState(false);
  const [startDates, setStartDate] = useState('');
  const [endDates, setEndDate] = useState('');
  const loading: boolean = useSelector(isLoadingSelector);
  const loadingDept = useSelector(isLoadingDept);
  const loadingBilling = useSelector(isLoadingWeeklyBilling);
  const classes = weeklyBillingReportStyle();
  const [selectedDept, setSelectedDept] = useState('all');
  const [billedHours, setBilledHours] = useState('');
  const [tarHours, setTarHours] = useState(0);
  const [totalCap, setTotalCap] = useState('');

  React.useEffect(() => {
    dispatch(weeklyBillingService.fetchWeeklyBillingReports());
    dispatch(deptService.fetchDepartmentList());
  }, []);

  const deptData: any = useSelector(deptSelector);
  const weeklyData: RowData[] = useSelector(weeklyBillingSelector);

  useEffect(() => {
    if (weeklyData?.length > 0 && !dateRef.current) {
      dateRef.current = true;
      // setStartDate(moment(weeklyData[0]?.startDate).format('YYYY-MM-DD'));
      // setEndDate(moment(weeklyData[0]?.endDate).format('YYYY-MM-DD'));
      setBilledHours(weeklyData[0]?.billedHours.toPrecision(4));
      setTarHours(weeklyData[0]?.targetedHours);
      setTotalCap(weeklyData[0]?.totalWeeklyCapacity.toPrecision(4));
    } else if (weeklyData?.length > 0) {
      setBilledHours(weeklyData[0]?.billedHours.toPrecision(4));
      setTarHours(weeklyData[0]?.targetedHours);
      setTotalCap(weeklyData[0]?.totalWeeklyCapacity.toPrecision(4));
    } else {
      setBilledHours('0');
      setTarHours(0);
      setTotalCap('0');
    }
  }, [weeklyData, dateRef.current, billedHours, tarHours, totalCap]);

  const handleGraphClose = () => {
    setShow(false);
  };
  const onChangeDate = (data: Record<string, string>) => {
    const selectedDepts = selectedDept === 'all' ? null : selectedDept;
    dispatch(weeklyBillingService.fetchWeeklyBillingReports('', selectedDepts, data?.startDate, data?.endDate, null));
  };

  // const exportWeeklyBillingReport = async () => {
  //   try {
  //     await weeklyBillingService.exportWeeklyBillingReport(JSON.stringify(weeklyData));
  //   } catch (error) {
  //     throw Error();
  //   }
  // };
  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: weeklyData?.map((row) => row.departmentName),
  };
  const series = weeklyData?.map((row) => row.totalWeeklyCapacity);
  console.log(series);

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    if (dept === 'all') {
      dispatch(weeklyBillingService.fetchWeeklyBillingReports());
    } else {
      setSelectedDept(dept);
      const deptFilter = dept === 'all' ? null : dept;
      dispatch(weeklyBillingService.fetchWeeklyBillingReports(null, deptFilter, startDates || null, endDates || null, null));
      if (weeklyData === null) {
        setBilledHours('0');
        setTarHours(0);
        setTotalCap('0');
      } else {
        setBilledHours(weeklyData[0].billedHours.toPrecision(4));
        setTarHours(weeklyData[0].targetedHours);
        setTotalCap(weeklyData[0].totalWeeklyCapacity.toPrecision(4));
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'departmentName',
      headerName: 'Department Name',
      flex: 1,
    },
    {
      field: 'projectName',
      headerName: 'Project Name',
      flex: 1,
    },
    {
      field: 'clientName',
      headerName: 'Client Name',
      flex: 1,
    },
    {
      field: 'weeklyBillingHours',
      headerName: 'Weekly-Hours',
      flex: 1,
    },
    {
      field: 'billingType',
      headerName: 'Billing Type',
      flex: 1,
    },
    {
      field: 'totalHoursBilled',
      headerName: 'Billed Hours',
      flex: 0.7,
    },
    {
      field: 'totalMinutesBilled',
      headerName: 'Billed Minutes',
      flex: 0.7,
    },
    {
      field: 'upworkId',
      headerName: 'UpWorkd ID',
      flex: 1,
    },
    {
      field: 'account',
      headerName: 'Account',
      flex: 1,
    },
  ];

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({ label: dep.departmentName, value: dep.departmentId }))
      : [];

  const rows = weeklyData?.map((item, i) => ({ ...item, id: i + 1 })) || [];

  return (
    <>
      <Grid container spacing={1} style={{ margin: '5px 0px' }}>
        <Grid item xs={3}>
          <Box>
            <CustomSelect
              options={options}
              value={selectedDept}
              onChange={onChangeDept}
              id="department-select"
              loading={loadingDept}
              label="Department"
            />
          </Box>
        </Grid>

        <Grid item xs={3} md={3}>
          <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: endDates }} />
        </Grid>

        <Grid item xs={3}>
          <Grid container className={classes.divBox}>
            <Grid item xs style={{ backgroundColor: '#f1416c', borderRadius: '5px' }}>
              <TextField
                id="standard-basic"
                label="Billed Hours"
                variant="outlined"
                size="small"
                value={billedHours}
                style={{ margin: '2px' }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: { backgroundColor: '#f1416c', padding: '2px', borderRadius: '5px', color: '#fff' },
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs style={{ backgroundColor: '#52EC3D', borderRadius: '5px', margin: '0px 2px' }}>
              <TextField
                id="standard-basic"
                label="Targeted Hours"
                variant="outlined"
                size="small"
                value={tarHours}
                style={{ margin: '2px' }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: { fontSize: '14px', backgroundColor: '#52EC3D', padding: '2px', borderRadius: '5px', color: '#fff' },
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs style={{ backgroundColor: '#3DBAEC', borderRadius: '5px' }}>
              <TextField
                id="standard-basic"
                label="Weekely Capacity"
                variant="outlined"
                size="small"
                value={`${totalCap} %`}
                style={{ margin: '2px' }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: '13.5px',
                    marginTop: '0px',
                    backgroundColor: '#3DBAEC',
                    padding: '2px',
                    borderRadius: '5px',
                    color: '#fff',
                  },
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3} style={{ display: 'flex', justifyContent: 'end', marginBottom: '5px' }}>
          {/* <SecondayButton onClick={() => setShow(true)}>Request Graph</SecondayButton> */}
          {/* <SecondayButton
            style={{ marginLeft: '5px' }}
            startIcon={<GridArrowDownwardIcon />}
            onClick={(e) => exportWeeklyBillingReport()}
          >
            Export
          </SecondayButton> */}
          <DialogModel
            open={show}
            title="Graph"
            onClose={handleGraphClose}
            dialogContent={<Chart options={chartOptions} series={series} type="pie" width={500} />}
          />
        </Grid>
      </Grid>

      <CustomDataGrid columns={columns} rows={rows} loading={loadingBilling} />
    </>
  );
}
