import React, { useEffect, useState, useRef } from 'react';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import reportService from 'services/reports.Request';
import deptService from 'services/dept.Request';
import { IDept } from 'features/Department/DeptModel';
import Swal from 'sweetalert2';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { setLoading } from 'actions/app.action';
import { isLoadingSelector, reportSelector } from 'selectors/report.selector';
import { GridColDef, GridAddIcon, GridArrowUpwardIcon } from '@mui/x-data-grid';
import { deptSelector, isLoadingSelector as isLoadingDept } from 'selectors/dept.selector';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import { countries } from 'helpers/countries';
import moment from 'moment';
import { activeReportsStyle } from './ActiveReport.style';

interface RowData {
  status: string;
  projectDepartments: ProjectReports[];
}

interface ProjectReports {
  projectDepId: string;
  departmentId: string;
  departmentName: string;
  clientId: string;
  clientName: string;
  country: string;
  projectId: string;
  accounts: string;
  contractName: string;
  contractType: string;
  hoursPerWeek: string;
  billingType: string;
  status: string;
  isActive: string;
}

export default function ActiveReports() {
  const dispatch = useDispatch();
  const refFile = useRef<any>();
  const classes = activeReportsStyle();
  const currentURL = window.location.href;
  const [selectedDept, setSelectedDept] = useState<any>('');
  const [selectedContractStatus, setContractStatus] = useState<any>('');
  const [fileList, setFileList] = useState<FileList | null>(null);
  const projectData: RowData[] = useSelector(reportSelector);
  const loading: boolean = useSelector(isLoadingSelector);
  const loadingDept = useSelector(isLoadingDept);
  const deptData = useSelector(deptSelector);
  const [startDates, setStartDate] = useState('');
  const [endDates, setEndDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  React.useEffect(() => {
    dispatch(deptService.fetchDepartmentList());
    dispatch(reportService.fetchReports());
  }, [dispatch]);

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    const SDate = startDates || null;
    const Edate = endDates || null;
    dispatch(reportService.fetchReports(dept === 'all' ? null : dept, selectedContractStatus, selectedCountry, SDate, Edate));
  };

  const onChangeContractStatus = (event: any) => {
    const contractStatus = event.target.value;
    const SDate = startDates || null;
    const Edate = endDates || null;
    setContractStatus(contractStatus);

    dispatch(
      reportService.fetchReports(selectedDept, contractStatus === 'all' ? null : contractStatus, selectedCountry, SDate, Edate),
    );
  };

  const exportProjectStatusReport = async () => {
    try {
      await reportService.exportProjectStatusReport();
    } catch (error) {
      throw Error();
    }
  };

  useEffect(() => {
    setSelectedDept(null);
    setContractStatus(null);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'accounts',
      headerName: 'Accounts',
      minWidth: 150,
    },
    {
      field: 'upWorkId',
      headerName: 'UpWork Id',
      minWidth: 150,
    },
    {
      field: 'contractName',
      headerName: 'Contract Name',
      minWidth: 150,
    },
    {
      field: 'clientName',
      headerName: 'Client Name',
      minWidth: 150,
    },
    {
      field: 'departmentName',
      headerName: 'Department(s)',
      minWidth: 250,
    },
    {
      field: 'employeeName',
      headerName: 'Employee(s)',
      minWidth: 250,
    },
    {
      field: 'hoursPerWeek',
      headerName: 'Weekly Hours',
      minWidth: 150,
    },
    {
      field: 'contractType',
      headerName: 'Contract Type',
      minWidth: 150,
    },
    {
      field: 'communication',
      headerName: 'Communication Mode',
      minWidth: 200,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 150,
      renderCell: (params) => {
        return params.row.startDate ? moment(params.row.startDate).format('MM-DD-YYYY') : '';
      },
    },
    {
      field: 'billingType',
      headerName: 'Billing Type',
      minWidth: 150,
    },
    {
      field: 'country',
      headerName: 'Country',
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
    },
    {
      field: 'closeDate',
      headerName: 'End Date',
      minWidth: 230,
      renderCell: (params) => {
        return params.row.closeDate ? moment(params.row.closeDate).format('MM-DD-YYYY') : '';
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      minWidth: 230,
    },
    {
      field: 'projectReview',
      headerName: 'Project Review',
      minWidth: 230,
    },
    {
      field: 'projectUrl',
      headerName: 'Project Url',
      minWidth: 230,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      minWidth: 230,
    },
  ];

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({ label: dep.departmentName, value: dep.departmentId }))
      : [];

  const ContractStatusOptions = [
    { label: 'Full Time', value: 'FullTime' },
    { label: 'Part Time', value: 'PartTime' },
    { label: 'Active But No Work', value: 'ActiveButNoWork' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);

    const response = await reportService.ImportProject(e.target.files);
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

    dispatch(reportService.fetchReports());
    setLoading(false);
    e.target.value = '';
  };

  const handelDownload = async () => {
    try {
      await reportService.downloadProjectSampleExcel();
    } catch (error) {
      throw Error();
    }
  };

  const onChangeCountry = (event: any) => {
    const currentCountry = event.target.value;
    setSelectedCountry(currentCountry);
    const SDate = startDates || null;
    const Edate = endDates || null;
    dispatch(
      reportService.fetchReports(
        selectedDept,
        selectedContractStatus,
        currentCountry === 'all' ? null : currentCountry,
        SDate,
        Edate,
      ),
    );
  };

  const onChangeDate = (value: Record<string, string>) => {
    dispatch(reportService.fetchReports(selectedDept, selectedContractStatus, selectedCountry, value.startDate, value.endDate));
    setStartDate(value.startDate);
    setEndDate(value.endDate);
  };

  return (
    <>
      <Grid container spacing={2} style={{ marginBottom: 10 }}>
        <Grid item xs={2} className={classes.flexBox}>
          <CustomSelect
            options={options}
            value={selectedDept}
            onChange={onChangeDept}
            id="department-select"
            loading={loadingDept}
            label="Department"
          />
        </Grid>
        <Grid item xs={2}>
          <CustomSelect
            options={ContractStatusOptions}
            value={selectedContractStatus}
            onChange={onChangeContractStatus}
            id="department-select"
            loading={loadingDept}
            label="Contract Status"
          />
        </Grid>
        <Grid item xs={2}>
          <CustomSelect
            options={[
              ...countries.map((country) => ({
                value: country.label,
                label: country.label,
              })),
            ]}
            value={selectedCountry}
            onChange={onChangeCountry}
            id="country-select"
            loading={loadingDept}
            label="Country"
          />
        </Grid>
        <Grid item xs={3}>
          <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: endDates }} />
        </Grid>

        <Grid item xs={3} className={classes.flexBox} style={{ marginLeft: 'auto', columnGap: 10, minHeight: '60px' }}>
          <PrimaryButton startIcon={<GridArrowUpwardIcon />} onClick={() => refFile?.current.click()} style={{ marginTop: 0 }}>
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

          <PrimaryButton startIcon={<GridAddIcon />} onClick={handelDownload} style={{ marginTop: 0 }}>
            Download Sample
          </PrimaryButton>
        </Grid>
      </Grid>

      <CustomDataGrid rows={projectData || []} columns={columns} getRowId={(row) => row?.projectId} loading={loading} />
    </>
  );
}
