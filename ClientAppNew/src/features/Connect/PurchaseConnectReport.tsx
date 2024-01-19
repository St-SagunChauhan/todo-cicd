import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid/index';
import { Box, FormControl, Grid, MenuItem, Paper, Select, TextField } from '@material-ui/core';
import { setLoading } from 'actions/app.action';
import Swal from 'sweetalert2';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { useDispatch, useSelector } from 'react-redux';
import teamLoggerServices from 'services/teamLogger.Request';
import { roleSelector } from 'selectors/auth.selector';
import moment from 'moment';
import { USER_ROLE } from 'configs';
import connectService from 'services/connect.Request';
import purchaseReportServices from 'services/purchaseConnects.Request';
import { ExportToExcel } from 'features/ExcelExport/excleDownload';
import { purchaseReportSelector } from 'selectors/purchaseconnects.selector';

export default function TeamLogger() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const dispatch = useDispatch();
  // const purchaseData: any = useSelector(purchaseReportSelector);
  const purchaseData = useSelector(purchaseReportSelector);

  console.log('purchaseData', purchaseData);
  const role = useSelector(roleSelector);
  const [createDate, setSelectDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;
  // const [startDates, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const onChangeDate = (e: any) => {
    const selectDate = e.target.value;
    setEndDate(selectDate);
    dispatch(purchaseReportServices.fetchPurchaseReportList(createDate, selectDate));
  };

  const columns: GridColDef[] = [
    { field: 'purchasedDate', headerName: 'PurchasedDate', width: 250 },
    {
      field: 'numberConnects',
      headerName: 'NumberConnects',
      width: 200,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 180,
      editable: true,
      renderCell: (param: any) => {
        return <div>${param.row.price}</div>;
      },
    },
    {
      field: 'upworkID',
      headerName: 'UpworkID',
      width: 300,
      editable: true,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 300,
      editable: true,
    },
    {
      field: 'connectsUsed',
      headerName: 'ConnectsUsed',
      width: 300,
      editable: true,
    },
  ];

  React.useEffect(() => {
    dispatch(purchaseReportServices.fetchPurchaseReportList());
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await purchaseReportServices.createpurchaseReport(e.target.files);
    dispatch(purchaseReportServices.fetchPurchaseReportList());
    if (response === 400) {
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
    dispatch(purchaseReportServices.fetchFiltredDataPurchase());
    setLoading(false);
    e.target.value = '';
  };

  // const onChangeStartDate = async (e: any) => {
  //   const startDate = e.target.value;
  //   setStartDate(startDate);

  // const dayOfWeek = 5;
  // const date = new Date(startDate);
  // const diff = date.getDay() - dayOfWeek;
  // if (diff > 0) {
  //   date.setDate(date.getDate() + 6);
  // } else if (diff < 0) {
  //   date.setDate(date.getDate() + -1 * diff);
  // }
  // dispatch(purchaseReportServices.fetchFiltredDataPurchase(null, startDate));

  return (
    <div>
      <Box m={2}>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <h3>From Date</h3>
            <TextField
              name="createdDate"
              id="date"
              type="date"
              value={createDate || null}
              onChange={(e) => setSelectDate(e.target.value)}
              required
              style={{ minWidth: 100 }}
            />
          </Grid>
          <Grid item xs={3}>
            <h3>Till Date</h3>
            <TextField
              name="createdDate"
              id="date"
              type="date"
              value={endDate || null}
              onChange={(e) => onChangeDate(e)}
              required
              style={{ minWidth: 100 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Paper>
        <Box m={2}>
          <Grid>
            <Grid container alignItems="center">
              <Grid item sm={8}>
                <h2>Purchase Connect History</h2>
              </Grid>
              {isInRole ? (
                <Box m={2}>
                  <label
                    htmlFor="purchase-btn"
                    style={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      padding: '0.5rem',
                      fontFamily: 'sans-serif',
                      borderRadius: '0.3rem',
                      cursor: 'pointer',
                      marginTop: ' 1rem',
                      marginLeft: '231px',
                    }}
                  >
                    <ArrowUpwardIcon style={{ fontSize: '1rem' }} />
                    <input
                      type="file"
                      id="purchase-btn"
                      onChange={handleFileChange}
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      hidden
                    />
                    Upload Excel
                  </label>
                  <ExportToExcel userDetail={purchaseData} Dynamiccolumn={columns} />
                </Box>
              ) : (
                ''
              )}
              {/* <TextField name="startDate" id="date" type="date" required /> */}
            </Grid>
          </Grid>

          {purchaseData && purchaseData !== null && (
            <Grid container spacing={2}>
              <Box style={{ height: 600, width: '100%', margin: 2, marginBottom: 4 }}>
                <DataGrid
                  rows={purchaseData}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  getRowId={(row) => row.id}
                />
              </Box>
            </Grid>
          )}
        </Box>
      </Paper>
    </div>
  );
}
