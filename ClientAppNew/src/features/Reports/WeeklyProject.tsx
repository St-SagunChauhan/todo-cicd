import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';
import deptService from 'services/dept.Request';
import { deptSelector } from 'selectors/dept.selector';
import weeklyProjectService from 'services/weeklyProject.Request';
import { weeklyProjectSelector } from 'selectors/weeklyProject.selector';

interface RowData {
  departmentName: string;
  projectReports: ProjectReports[];
}

interface ProjectReports {
  contractType: string;
  accounts: string;
  clientEmail: string;
  contractName: string;
  hoursPerWeek: string;
  billingType: string;
  country: string;
  departmentName: string;
}

export default function CollapsibleTable() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(weeklyProjectService.fetchWeeklyProjectReports());
    dispatch(deptService.fetchDepartmentList());
  }, [dispatch]);

  const deptData = useSelector(deptSelector);
  const weeklyProject: RowData[] = useSelector(weeklyProjectSelector);

  if (deptData != null && weeklyProject != null) {
    for (let index = 0; index < deptData.length; index++) {
      const element = deptData[index];
      const isExists = weeklyProject.some((x: { departmentName: string }) => x.departmentName === element.departmentName);
      if (!isExists) {
        const data: any = [];
        data.departmentName = element.departmentName;
        data.projectReports = [];
        weeklyProject.push(data);
      }
    }
  }
  return (
    <>
      <h2>Project-Report Sheet</h2>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Department Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeklyProject?.length > 0 &&
              weeklyProject?.map((item: any) => {
                return <Row key={item?.departmentName} row={item} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  function Row(props: { row: RowData }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <TableRow style={{ backgroundColor: '#a7e9c2', fontWeight: '1000' }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.departmentName}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box style={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Weekly-Report
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Contract Type</TableCell>
                      <TableCell>Accounts</TableCell>
                      <TableCell align="right">Client Email</TableCell>
                      <TableCell align="right">Contract Name</TableCell>
                      <TableCell align="right">Hours Per Week</TableCell>
                      <TableCell align="right">Billing Type</TableCell>
                      <TableCell align="right">Country</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.projectReports.length > 0 ? (
                      row.projectReports.map((finalReport: any, i: number) => {
                        return (
                          <TableRow key={i}>
                            <TableCell component="th" scope="row">
                              {finalReport.contractType}
                            </TableCell>
                            <TableCell>{finalReport.accounts}</TableCell>
                            <TableCell align="right">{finalReport.clientEmail}</TableCell>
                            <TableCell align="right"> {finalReport.contractName}</TableCell>
                            <TableCell align="right">{finalReport.hoursPerWeek}</TableCell>
                            <TableCell align="right">{finalReport.billingType}</TableCell>
                            <TableCell align="right">{finalReport.country}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <p style={{ textAlign: 'center' }}>No Data</p>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}
