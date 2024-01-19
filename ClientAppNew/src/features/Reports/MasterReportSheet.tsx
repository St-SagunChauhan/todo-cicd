import React, { useEffect, useRef, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { deptSelector } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
// import { TextField } from '@material-ui/core';
import moment from 'moment';
import deptService from 'services/dept.Request';
import masterReportService from 'services/masterReport';
import { isLoadingSelector, masterReportSelector } from 'selectors/masterReport.selector';
import CustomizedBreadcrumbs from 'components/molecules/CustomizedBreadcrumbs/CustomizedBreadcrumbs';
import DistortedChart from 'components/molecules/Charts/DistortedChart/DistortedChat';
import DonutChart from 'components/molecules/Charts/DonutChart/DonutChart';
import LineChart from 'components/molecules/Charts/LineChart/LineChart';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import { IMasterReport } from './MasterReport';
import loadingImg from '../../assets/images/blue_loading.gif';
import { MasterReportStyle } from './MasterReportSheet.style';

function MasterReports() {
  const dispatch = useDispatch();
  const deptList: IDept[] = useSelector(deptSelector);
  const masterReport: IMasterReport[] = useSelector(masterReportSelector);
  const dateRef = useRef(false);
  const [startDates, setStartDate] = useState('');
  const [currentDates, setcurrentDate] = useState('');
  const loading: boolean = useSelector(isLoadingSelector);
  const classes = MasterReportStyle();

  useEffect(() => {
    dispatch(masterReportService.fetchmasterbillingReport());
    dispatch(deptService.fetchDepartmentList());
  }, [dispatch]);

  useEffect(() => {
    if (masterReport?.length > 0 && !dateRef.current) {
      dateRef.current = true;
      setStartDate(moment(masterReport[0]?.startDate).format('YYYY-MM-DD'));
      setcurrentDate(moment(masterReport[0]?.currentDate).format('YYYY-MM-DD'));
    }
  }, [masterReport]);

  const onChangeDate = (data: Record<string, string>) => {
    setcurrentDate(data?.endDate);
    setStartDate(data?.startDate);
    dispatch(masterReportService.fetchmasterbillingReport(data?.startDate, data?.endDate));
  };

  // const getCategories = () => {
  //   const categories: string[] = [];
  //   if (masterReport) {
  //     masterReport.forEach((row) => {
  //       if (row.startDate) {
  //         categories.push(moment(row.startDate).format('MM-DD-YYYY'));
  //       }
  //     });
  //     if (categories.length > 0 && masterReport.length > 0) {
  //       categories.push(moment(masterReport[0].currentDate).format('MM-DD-YYYY'));
  //     }
  //   }

  //   return uniq(categories);
  // };

  if (deptList != null && masterReport != null) {
    for (let index = 0; index < deptList.length; index++) {
      const element = deptList[index];
      const isExists = masterReport.some((x: { departmentName: string }) => x.departmentName === element.departmentName);
      if (!isExists) {
        const data: any = [];
        data.departmentName = element.departmentName;
        data.overallDepartmentBilling = 0;
        data.overallTragetedBilling = 0;
        data.overallcapacity = 0;
        masterReport.push(data);
      }
    }
  }

  const seriesList = masterReport ? masterReport?.map((row) => Number(row.overallcapacity.toPrecision(4))) : [];

  const newData: ApexOptions['series'] = [
    {
      name: 'Capacity',
      data: seriesList,
    },
  ];

  const catData = masterReport ? masterReport?.map((row) => row.departmentName) : [];

  // const exportMasterReport = async () => {
  //   try {
  //     await masterReportService.exportMasterReport();
  //   } catch (error) {
  //     throw Error();
  //   }
  // };

  const monthlyOverview = masterReport?.map((item) => item.overallcapacity) || [];
  const monthlyOverviewLabels = masterReport?.map((item) => item.departmentName) || [];
  const startDate = masterReport?.map((item) => item.startDate) || null;

  // Line Chart Data
  const lineChartLabels = masterReport?.map((item) => item.departmentName) || [];
  const lineChartData = masterReport?.map((item) => item.overallTragetedBilling) || [];
  const lineChartDynamicData = masterReport?.map((item) => item.overallDepartmentBilling) || [];

  const lineChartSeries: ApexOptions['series'] = [
    {
      name: 'Hours Target',
      data: lineChartData,
    },
    {
      name: 'Billed Hours',
      data: lineChartDynamicData,
    },
  ];

  return (
    <div>
      <Box className={classes.header}>
        <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: currentDates }} />
      </Box>
      <Grid container>
        <Grid item xs={12}>
          {loading ? (
            <img className={classes.loader} src={loadingImg} alt="loding-img" />
          ) : (
            <>
              <Grid container item xs={12}>
                <Grid container justifyContent="flex-end" xs={3}>
                  <Box m={2} style={{ alignItems: 'right' }}>
                    {/* <Grid>
                          <Button
                            style={{
                              border: '2px solid #1976d2',
                              backgroundColor: '#1976d2',
                            }}
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<GridArrowDownwardIcon />}
                            onClick={(e) => exportMasterReport()}
                          >
                            Export
                          </Button>
                        </Grid> */}
                  </Box>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" spacing={2} className={classes.doubleChart}>
                <Grid item xs={6}>
                  <Paper elevation={4}>
                    <DonutChart title="Monthly Overview" data={monthlyOverview} labels={monthlyOverviewLabels} />
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={4}>
                    <DistortedChart title="Current Month Report" series={newData} categories={catData} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper elevation={4}>
                    <LineChart title="Capacity Of Teams" series={lineChartSeries} labels={lineChartLabels} />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default MasterReports;
