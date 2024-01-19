import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import deptService from 'services/dept.Request';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { deptSelector, isLoadingSelector as isLoadingDept } from 'selectors/dept.selector';
import connectHistoryReportService from 'services/connectHistory.Request';
import { connectHistorySelector, isLoadingSelector } from 'selectors/connectHistory.selector';
import { GridArrowDownwardIcon, GridAddIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid';
import { IDept } from 'features/Department/DeptModel';
import { setLoading } from 'actions/app.action';
import Swal from 'sweetalert2';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import { connectHistoryReportsStyle } from './ConnectHistoryReport.style';

interface RowData {
  departmentName: string;
  startDate: string;
  endDate: string;
  connectSubReports: ConnectSubReportResponse[];
}

interface ConnectSubReportResponse {
  employeeName: string;
  departmentName: string;
  jobUrl: string;
  connectUsed: string;
  status: string;
  upWorkId: string;
  Connect_Date: string;
  departmentId: string;
  connectId: string;
  marketingQualifiedLeads: number;
  salesQualifiedLeads: number;
  technology: string;
  dealsWon: number;
}

export default function CollapsibleTable() {
  const dispatch = useDispatch();
  const refFile = useRef<any>();
  const currentURL = window.location.href;
  const dateRef = useRef(false);
  const [startDates, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [endDates, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const loading: boolean = useSelector(isLoadingSelector);
  const loadingConnectHistory = useSelector(isLoadingSelector);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [show, setShow] = useState(false);
  const classes = connectHistoryReportsStyle();
  const [selectedDept, setSelectedDept] = useState('all');

  React.useEffect(() => {
    dispatch(connectHistoryReportService.fetchConnectHistoryReports());
    dispatch(deptService.fetchDepartmentList());
  }, [dispatch]);

  const deptData = useSelector(deptSelector);
  const HistoryReport: RowData[] = useSelector(connectHistorySelector);
  const loadingDept = useSelector(isLoadingDept);

  useEffect(() => {
    if (HistoryReport?.length > 0 && !dateRef.current) {
      dateRef.current = true;
      setStartDate(moment(HistoryReport[0]?.startDate).format('YYYY-MM-DD'));
      setEndDate(moment(HistoryReport[0]?.endDate).format('YYYY-MM-DD'));
    }
  }, [HistoryReport, dateRef.current]);
  console.log(HistoryReport);
  if (!HistoryReport) return null;

  // if (deptData != null && HistoryReport != null) {
  //   for (let index = 0; index < deptData.length; index++) {
  //     const element = deptData[index];
  //     const isExists = HistoryReport.some((x: { departmentName: string }) => x.departmentName === element.departmentName);
  //     if (!isExists) {
  //       const data: any = [];
  //       data.departmentName = element.departmentName;
  //       data.connectSubReports = [];
  //       HistoryReport.push(data);
  //     }
  //   }
  // }

  const onChangeDate = (e: any) => {
    const endDate = e.target.value;
    setEndDate(endDate);
    dispatch(connectHistoryReportService.fetchConnectHistoryReports('', null, endDate, startDates));
  };

  const exportConnectHistoryReport = async () => {
    try {
      await connectHistoryReportService.exportConnectHistoryReport();
    } catch (error) {
      throw Error();
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);

    const response = await connectHistoryReportService.ImportProject(e.target.files);
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

    dispatch(connectHistoryReportService.fetchConnectHistoryReports());
    setLoading(false);
    e.target.value = '';
  };

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    const deptFilter = dept === 'all' ? null : dept;
    dispatch(connectHistoryReportService.fetchConnectHistoryReports(null, deptFilter, null, null));
  };

  const columns: GridColDef[] = [
    {
      field: 'employeeName',
      headerName: 'Profile Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      flex: 0.4,
      minWidth: 200,
    },
    {
      field: 'upWorkId',
      headerName: 'UpWork Id',
      flex: 0.4,
      minWidth: 200,
    },
    {
      field: 'jobUrl',
      headerName: 'Job-Url',
      flex: 0.6,
      minWidth: 200,
    },
    {
      field: 'connectUsed',
      headerName: 'Connects Used',
      flex: 0.6,
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 200,
    },
    {
      field: 'connect_Date',
      headerName: 'Connect Date',
      flex: 0.6,
      minWidth: 200,
      renderCell: (param: any) => {
        return moment(param?.row.connect_Date).format('YYYY-MM-DD');
      },
    },
    {
      field: 'marketingQualifiedLeads',
      headerName: 'Marketing Qualified Leads',
      flex: 0.6,
      minWidth: 200,
    },
    {
      field: 'salesQualifiedLeads',
      headerName: 'Sales Qualified Leads',
      flex: 0.6,
      minWidth: 200,
    },
    {
      field: 'technology',
      headerName: 'Technology',
      flex: 0.6,
      minWidth: 200,
    },
    {
      field: 'dealsWon',
      headerName: 'Deals Won',
      flex: 0.6,
      minWidth: 200,
    },
  ];

  const handelDownload = async () => {
    try {
      await connectHistoryReportService.exportConnectHistoryReport();
    } catch (error) {
      throw Error();
    }
  };

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({ label: dep.departmentName, value: dep.departmentId }))
      : [];

  return (
    <>
      <Box marginY={2} className={classes.flexBox}>
        <Box className={classes.flexBox}>
          <Box className={classes.flexBox}>
            <CustomSelect
              options={options}
              value={selectedDept}
              onChange={onChangeDept}
              id="department-select"
              loading={loadingDept}
              label="Department"
            />
          </Box>
        </Box>
        {currentURL.includes('/active-reports') ? (
          <SecondayButton startIcon={<GridArrowDownwardIcon />} onClick={(e) => exportConnectHistoryReport()}>
            Export
          </SecondayButton>
        ) : (
          ''
        )}
      </Box>

      <CustomDataGrid rows={HistoryReport || []} columns={columns} getRowId={(row) => row?.connectId} loading={loading} />
    </>
  );
}
