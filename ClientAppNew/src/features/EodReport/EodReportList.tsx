import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, FormControl, Grid, MenuItem, Select, TextField, FormLabel } from '@material-ui/core';
import DialogModel from 'common/Dialog';
import { deptSelector, isLoadingSelector as isLoadingDept } from 'selectors/dept.selector';
import eodReportService from 'services/eodReportRequest';
import deptService from 'services/dept.Request';
import AddIcon from '@material-ui/icons/Add';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import moment from 'moment';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid/index';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import { useDispatch, useSelector } from 'react-redux';
import { eodReportSelector } from 'selectors/eodReport.selector';
import { isLoadingSelector } from 'selectors/app.selector';
import { IDept } from 'features/Department/DeptModel';
import CustomizedBreadcrumbs from 'components/molecules/CustomizedBreadcrumbs/CustomizedBreadcrumbs';
import ReportsRow from 'features/Reports/ReportsRow';
import AddEodReportModal from './AddEodReportModal';
import loadingImg from '../../assets/images/blue_loading.gif';
import { eodReportStyle } from './eodReport.style';

interface RowData {
  departmentName: string;
  status: string;
  eodSubReport: EodReportResponseData[];
}

interface EodReportResponseData {
  employeeName: string;
  contractName: string;
  billingHours: number;
  employeeDelightHours: number;
  unbilledHours: number;
  isActive: boolean;
  projectHours: any;
  eodDate: any;
}

export default function ProjectBillingList() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const classes = eodReportStyle();
  const [startDates, setStartDate] = useState('');
  const [currentDates, setcurrentDate] = useState('');
  const [rowData, setRowData] = useState(null);
  const eodData = useSelector(eodReportSelector);
  const loading = useSelector(isLoadingSelector);
  const handleCloseDialog = (): void => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  // React.useEffect(() => {
  //   dispatch(eodReportService.fetchEodReportList());
  //   dispatch(deptService.fetchDepartmentList());
  // }, [dispatch]);

  useEffect(() => {
    if (eodData === null) {
      dispatch(eodReportService.fetchEodReportList());
    } else {
      const rows = eodData.map((eod: any, key: number) => ({
        employeeName: eod.employeeName,
        contractName: eod.contractName,
        billingHours: eod.billingHours,
        employeeDelightHours: eod.employeeDelightHours,
        unbilledHours: eod.unbilledHours,
        isActive: eod.isActive,
        projectHours: eod.projectHours,
        eodDate: eod.eodDate,
      }));
      setRowData(rows);
    }
  }, []);

  // const deptData = useSelector(deptSelector);
  // const [selectedDept, setSelectedDept] = useState('all');
  // const eodData: RowData[] = useSelector(eodReportSelector);

  // const loading: boolean = useSelector(isLoadingSelector);
  // const classes = eodReportStyle();

  // if (deptData != null && eodData != null) {
  //   for (let index = 0; index < deptData.length; index++) {
  //     const element = deptData[index];
  //     const isExists = eodData.some((x: { departmentName: string }) => x.departmentName === element.departmentName);
  //     if (!isExists) {
  //       const data: any = [];
  //       data.departmentName = element.departmentName;
  //       data.eodSubReport = [];
  //       eodData.push(data);
  //     }
  //   }
  // }

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'Employee Name',
      flex: 0.7,
    },
    {
      field: 'projectBilling',
      headerName: 'Projects Billing',
      flex: 0.9,
    },
    {
      field: 'employeeDelightHours',
      headerName: 'Delight Hours',
      flex: 0.9,
    },
    {
      field: 'eodDate',
      headerName: 'EOD Date',
      flex: 0.6,
      renderCell: (param: any) => {
        if (param?.row.eodDate) {
          return moment(param?.row.eodDate).format('MM-DD-YYYY');
        }
        return '';
      },
    },
  ];

  const onChangeDate = (data: Record<string, string>) => {
    setcurrentDate(data?.endDate);
    setStartDate(data?.startDate);
    dispatch(eodReportService.fetchEodReportList(data?.startDate, data?.endDate));
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={10} style={{ display: 'flex' }}>
          <Box style={{ display: 'flex', flexDirection: 'row-reverse', justifyItems: 'end' }}>
            <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: currentDates }} />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyItems: 'end' }}>
            <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
              Add EOD Report
            </SecondayButton>
          </div>
          <DialogModel
            open={isOpen}
            title="Add Asset"
            dialogContent={<AddEodReportModal handleClose={handleCloseDialog} isOpen={isOpen} />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loading ? (
            <img className={classes.loader} src={loadingImg} alt="loading-img" />
          ) : (
            <>
              <CustomDataGrid rows={eodData || []} columns={columns} getRowId={(row) => row?.eodReportId} loading={loading} />
            </>
          )}
          {/* <DialogModel
            open={isOpenEditModal}
            title="Edit Asset"
            dialogContent={<EditAssetsModel isOpen={isOpenEditModal} data={editRow} handleClose={handleCloseDialog} />}
          /> */}
        </Grid>
      </Grid>
    </>
  );
}
