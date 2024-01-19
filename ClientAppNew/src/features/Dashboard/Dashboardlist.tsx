import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { dashBoardSelector } from 'selectors/dashBoard.selector';
import deptService from 'services/dept.Request';
import dashService from 'services/dashBoardService';
import { IDashboardRequest } from './Dashclass';

export default function Dashboardlist() {
  const mySeries = [] as number[];
  const dispatch = useDispatch();
  const dashBoardList: IDashboardRequest = useSelector(dashBoardSelector);
  if (dashBoardList !== null) {
    mySeries.push(
      dashBoardList?.totalTargetHours,
      dashBoardList?.totalBilledHours,
      dashBoardList?.totalWeeklyHours,
      dashBoardList?.totalUnbilledHours,
      dashBoardList?.overAllCapacity,
    );
  }
  useEffect(() => {
    dispatch(dashService.fetchDashBoardList());
    dispatch(deptService.fetchDepartmentList());
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Total Targeted Hours', 'Total Billed Hours', 'Total Weekly Hours', 'Total Unbillable Hours', 'OverAll Capacity'],
  };

  const series = mySeries as unknown as ApexOptions['series'];

  const optionEmployees: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: dashBoardList?.dashBoardEmployees?.map((row) => row.employeeName) || [],
  };

  const serieEmployees = dashBoardList?.dashBoardEmployees?.map((row) => row.employeeBilledHours) || [];

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Paper>
            <Box m={2}>
              <Grid container item xs={12}>
                <h2>{dashBoardList?.departmentName} Team Overview</h2>
              </Grid>
              <Grid container justifyContent="space-between">
                <Grid item xs={12} sm={12} md={4}>
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ fontWeight: 700 }}>Department Name</TableCell>
                          <TableCell style={{ fontWeight: 700 }} component="th" scope="row">
                            {dashBoardList?.departmentName}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: 700 }}>Total Targeted Hours</TableCell>
                          <TableCell>{dashBoardList?.totalTargetHours?.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: 700 }}>Total Weekly Hours</TableCell>
                          <TableCell>{dashBoardList?.totalWeeklyHours?.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: 700 }}>Total Billed Hours</TableCell>
                          <TableCell>{dashBoardList?.totalBilledHours?.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: 700 }}>Total Unbillable Hours</TableCell>
                          <TableCell>{dashBoardList?.totalUnbilledHours?.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: 700 }}>OverAll Capacity</TableCell>
                          <TableCell style={{ fontWeight: 700 }}>{dashBoardList?.overAllCapacity?.toFixed(2)}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid container justifyContent="center" item xs={12} sm={12} md={6}>
                  <div>
                    <Chart options={options} series={series} type="pie" width={500} />
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Paper>
              <Box m={2}>
                <Grid container item xs={12}>
                  <h2>Team Overview</h2>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid>
                    <TableContainer>
                      <Table aria-label="simple table">
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ fontWeight: 700 }}>Employee Name</TableCell>
                            <TableCell style={{ fontWeight: 700 }}>Employee Designation</TableCell>
                            <TableCell style={{ fontWeight: 700 }}>Total Targeted Hours</TableCell>
                            <TableCell style={{ fontWeight: 700 }}>Total Billed Hours</TableCell>
                            <TableCell style={{ fontWeight: 700 }}>Total Billable Hours</TableCell>
                            <TableCell style={{ fontWeight: 700 }}>Total UnBilled Hours</TableCell>
                          </TableRow>
                          {dashBoardList?.dashBoardEmployees.map((row) =>
                            row.employeeBilledHours == 0 ? (
                              <TableRow key={row.employeeName} style={{ backgroundColor: '#ee8787' }}>
                                <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{row.employeeName}</TableCell>
                                <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{row.employeeDesignation}</TableCell>
                                <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                  {row.employeeTargetedHours}
                                </TableCell>
                                <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{row.employeeBilledHours}</TableCell>
                                <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                  {row.employeeBillableHours}
                                </TableCell>
                                <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                  {row.employeeUnBilledHours}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow key={row.employeeName}>
                                <TableCell>{row.employeeName}</TableCell>
                                <TableCell>{row.employeeDesignation}</TableCell>
                                <TableCell>{row.employeeTargetedHours}</TableCell>
                                <TableCell>{row.employeeBilledHours}</TableCell>
                                <TableCell>{row.employeeBillableHours}</TableCell>
                                <TableCell>{row.employeeUnBilledHours}</TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid>
                    <Grid container justifyContent="center" item xs={12} sm={12} md={6}>
                      <div>
                        <Chart options={optionEmployees} series={serieEmployees} type="pie" width={500} />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
