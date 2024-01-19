import React, { useEffect, useState, useRef } from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import hiringListService from 'services/hiringList.Request';
import { IDept } from 'features/Department/DeptModel';
import Swal from 'sweetalert2';
import { activeReportsStyle } from 'features/Reports/ActiveReport.style';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { setLoading } from 'actions/app.action';
import { isLoadingSelector, reportSelector } from 'selectors/report.selector';
import { GridColDef, GridAddIcon, GridArrowUpwardIcon } from '@mui/x-data-grid';
import { deptSelector, isLoadingSelector as isLoadingDept } from 'selectors/dept.selector';
import { hiringListSelector, isLoadingSelector as hiringListLoading, hiringListError } from 'selectors/HiringList.selector';

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

export default function HiringList() {
  const dispatch = useDispatch();
  const refFile = useRef<any>();
  const classes = activeReportsStyle();
  const currentURL = window.location.href;
  const [selectedDept, setSelectedDept] = useState<any>('');
  const [selectedContractType, setContractType] = useState<any>('');
  const [fileList, setFileList] = useState<FileList | null>(null);
  const projectData: RowData[] = useSelector(hiringListSelector);
  const loading: boolean = useSelector(isLoadingSelector);
  const loadingDept = useSelector(isLoadingDept);
  const deptData = useSelector(deptSelector);

  React.useEffect(() => {
    dispatch(hiringListService.fetchHiringListReports());
  }, [dispatch]);

  const exportHiringList = async () => {
    try {
      await hiringListService.exportHiringListReport();
    } catch (error) {
      throw Error();
    }
  };

  useEffect(() => {
    setSelectedDept(null);
    setContractType(null);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
    },
    {
      field: 'sourceofCV',
      headerName: 'SourceofCV',
      minWidth: 150,
    },
    {
      field: 'contactDetails',
      headerName: 'Contact Details',
      minWidth: 150,
    },
    {
      field: 'department',
      headerName: 'Department',
      minWidth: 150,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      minWidth: 250,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 150,
    },
    {
      field: 'interviewScheduled',
      headerName: 'Interview Scheduled',
      minWidth: 150,
    },
    {
      field: 'totalExperience',
      headerName: 'Total Experience',
      minWidth: 200,
    },
    {
      field: 'currentSalary',
      headerName: 'Current Salary',
      minWidth: 150,
    },
    {
      field: 'expectedSalary',
      headerName: 'Expected Salary',
      minWidth: 150,
    },
    {
      field: 'pfAccount',
      headerName: 'PFAccount',
      minWidth: 150,
    },
    {
      field: 'currentEmployer',
      headerName: 'Current Employer',
      minWidth: 230,
    },
    {
      field: 'noticePeriod',
      headerName: 'Notice Period',
      minWidth: 230,
    },
    {
      field: 'result',
      headerName: 'Result',
      minWidth: 230,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      minWidth: 230,
    },
    {
      field: 'round',
      headerName: 'Round',
      minWidth: 230,
    },
    {
      field: 'conductedBy',
      headerName: 'Conducted By',
      minWidth: 250,
    },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);

    const response = await hiringListService.ImportHiringList(e.target.files);
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

    dispatch(hiringListService.fetchHiringListReports());
    setLoading(false);
    e.target.value = '';
  };

  const handelDownload = async () => {
    try {
      await hiringListService.downloadProjectSampleExcel();
    } catch (error) {
      throw Error();
    }
  };

  return (
    <>
      <Box style={{ display: 'flex', columnGap: 10, justifyContent: 'end' }}>
        <PrimaryButton startIcon={<GridArrowUpwardIcon />} onClick={() => refFile?.current.click()}>
          <input
            ref={refFile}
            id="file"
            type="file"
            hidden
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => {
              handleFileChange(e);
            }}
          />
          Upload File
        </PrimaryButton>

        <PrimaryButton startIcon={<GridAddIcon />} onClick={handelDownload}>
          Download Hiring List Sample Excel
        </PrimaryButton>
      </Box>
      <Box marginY={2} className={classes.flexBox}>
        {/* {currentURL.includes('/active-reports') ? (
          <SecondayButton startIcon={<GridArrowDownwardIcon />} onClick={(e) => exportProjectStatusReport()}>
            Export
          </SecondayButton>
        ) : (
          ''
        )} */}
      </Box>
      <CustomDataGrid rows={projectData || []} columns={columns} getRowId={(row) => row?.hiringListId} loading={loading} />
    </>
  );
}
