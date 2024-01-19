import React, { useEffect, useState, useRef } from 'react';
import { DataGrid, GridAddIcon, GridArrowDownwardIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid/index';
import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, MenuList, Paper, Select, TextField } from '@material-ui/core';
import { setLoading } from 'actions/app.action';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { useDispatch, useSelector } from 'react-redux';
import { roleSelector } from 'selectors/auth.selector';
import { USER_ROLE } from 'configs';
import hRExpenseServices from 'services/hrExpense.Request';
import { hrExpenseSelector } from 'selectors/hrExpense.selector';
import Swal from 'sweetalert2';
import moment from 'moment';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import expenseCategoryService from 'services/expenseCategory.Request';

export default function TeamLogger() {
  const refFile = useRef<any>();
  const [fileList, setFileList] = useState<FileList | null>(null);
  const hrExpenseData: any = useSelector(hrExpenseSelector);
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState('all');
  const [loadingYear, setLoadingYear] = useState(true);
  const [years, setYears] = useState<any>([]);
  const role = useSelector(roleSelector);
  // const [uploadYear, setYear] = useState();
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;
  const loadingHrEx = useSelector(hrExpenseSelector);

  const onChangeYear = (e: any) => {
    const year = e.target.value;
    console.log(year);
    setSelectedYear(year);
    if (year === 'all') {
      dispatch(hRExpenseServices.fetchHRExpensesList());
    } else {
      dispatch(hRExpenseServices.fetchHRExpensesList(year));
    }
  };

  const columns: GridColDef[] = [
    { field: 'expenseName', headerName: 'Expense Name', width: 250 },
    {
      field: 'january',
      headerName: 'January',
      width: 180,
      editable: true,
    },
    {
      field: 'february',
      headerName: 'February',
      width: 150,
      editable: true,
    },
    {
      field: 'march',
      headerName: 'March',
      width: 150,
      editable: true,
    },
    {
      field: 'april',
      headerName: 'April',
      width: 150,
      editable: true,
    },
    {
      field: 'may',
      headerName: 'May',
      width: 150,
      editable: true,
    },
    {
      field: 'june',
      headerName: 'June',
      width: 150,
      editable: true,
    },
    {
      field: 'july',
      headerName: 'July',
      width: 150,
      editable: true,
    },
    {
      field: 'august',
      headerName: 'August',
      width: 150,
      editable: true,
    },
    {
      field: 'september',
      headerName: 'September',
      width: 150,
      editable: true,
    },
    {
      field: 'october',
      headerName: 'October',
      width: 150,
      editable: true,
    },
    {
      field: 'november',
      headerName: 'November',
      width: 150,
      editable: true,
    },
    {
      field: 'december',
      headerName: 'December',
      width: 150,
      editable: true,
    },
    {
      field: 'expenseYear',
      headerName: 'Expense Year',
      width: 150,
      editable: true,
    },
  ];

  React.useEffect(() => {
    dispatch(hRExpenseServices.fetchHRExpensesList());
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await hRExpenseServices.createHrExpensesReport(e.target.files);
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
    dispatch(hRExpenseServices.fetchHRExpensesList());
    setLoading(false);
    e.target.value = '';
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const allYears = [];
    for (let year = currentYear; year >= 1990; year--) {
      allYears.push(year.toPrecision(4));
    }

    const years = allYears.map((id: any) => ({
      label: id,
      value: id,
    }));

    setYears(years);
    setLoadingYear(false);
  }, []);
  const handelDownload = async () => {
    try {
      await expenseCategoryService.downloadExpenseCategory();
    } catch (error) {
      throw Error();
    }
  };
  return (
    <div style={{ marginBottom: '5px' }}>
      <Grid container alignItems="center">
        <Grid item xs={1}>
          <CustomSelect
            options={years}
            value={selectedYear}
            onChange={onChangeYear}
            id="year-select"
            loading={loadingYear}
            label="Year"
          />
        </Grid>

        {isInRole ? (
          <Grid alignItems="center" xs={11} style={{ display: 'flex', justifyContent: 'end' }}>
            <Box mb={1}>
              <SecondayButton startIcon={<GridAddIcon />} onClick={handelDownload}>
                Download Expense Category
              </SecondayButton>
              <SecondayButton
                onClick={() => refFile?.current.click()}
                style={{ marginLeft: '5px' }}
                startIcon={<GridArrowUpwardIcon />}
              >
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
                UPLOAD EXCEL
              </SecondayButton>
            </Box>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
      <Grid container item xs={12}>
        {hrExpenseData && hrExpenseData !== null && (
          <CustomDataGrid
            rows={hrExpenseData || []}
            columns={columns}
            getRowId={(row) => row?.expenseId}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        )}
      </Grid>
    </div>
  );
}
