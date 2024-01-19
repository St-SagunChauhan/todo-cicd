import { Grid, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ConnectHistoryEnum } from 'Enums/ConnectEnum/ConnectEnum';
import { IDept } from 'features/Department/DeptModel';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deptSelector } from 'selectors/dept.selector';
import { capacitySelector, isLoadingSelector } from 'selectors/capacity.selector';
import deptService from 'services/dept.Request';
import capacityReportService from 'services/capacityReport';

export default function CapacityReport() {
  const dispatch = useDispatch();
  useSelector(isLoadingSelector);
  const deptData = useSelector(deptSelector);
  const [rowData, setRowData] = useState([]);
  const capacity = useSelector(capacitySelector);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const loading: boolean = useSelector(isLoadingSelector);

  React.useEffect(() => {
    dispatch(capacityReportService.fetchCapacityReports());
    dispatch(deptService.fetchDepartmentList());
  }, [dispatch]);

  React.useEffect(() => {
    const list = () => {
      if (capacity) {
        const rows = capacity.map((capacity: any, index: number) => ({
          id: index,
          departmentName: capacity.departmentName,
          totalBilledHours: capacity.totalBilledHours,
          totalBillingHours: capacity.totalBillingHours,
          week: capacity.week,
          billingDate: moment(capacity.billingDate).format('YYYY-MM-DD '),
          capacity: capacity.capacity?.toFixed(1),
        }));
        setRowData(rows);
      }
    };
    list();
  }, [dispatch, capacity]);

  const columns: GridColDef[] = [
    {
      field: 'departmentName',
      headerName: 'Department Name',
      width: 250,
      editable: true,
    },
    {
      field: 'totalBilledHours',
      headerName: 'Total Billed Hours',
      width: 250,
      editable: true,
    },
    {
      field: 'totalBillingHours',
      headerName: 'Total Billing Hours',
      width: 250,
      editable: true,
    },
    {
      field: 'week',
      headerName: 'Week',
      width: 250,
      editable: true,
    },
    {
      field: 'billingDate',
      headerName: 'Billing Date',
      width: 250,
      editable: true,
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 250,
      editable: true,
    },
  ];

  const onChangeDate = (e: any) => {
    const endDate = e.target.value;
    dispatch(capacityReportService.fetchCapacityReports('', null, endDate, startDate));
  };
  const onChangeDept = (e: any) => {
    let dept;
    let week;
    if (e.target.name === 'department') {
      dept = e.target.value;
      week = selectedWeek;
      setSelectedDept(dept);
    } else if (e.target.name === 'week') {
      dept = selectedDept;
      week = e.target.value;
      setSelectedWeek(week);
    }

    const deptFilter = dept === 'all' ? null : dept;
    const weekFilter = week === 'all' ? null : week;
    dispatch(capacityReportService.fetchCapacityReports(weekFilter, deptFilter));
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </GridToolbarContainer>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <InputLabel id="demo-simple-select-helper-label"> Department</InputLabel>
          <FormControl style={{ minWidth: 300, height: 100 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label=""
              name="department"
              onChange={onChangeDept}
              value={selectedDept}
            >
              {deptData &&
                deptData.length &&
                deptData?.map((dept: IDept, key: number) => {
                  return (
                    <MenuItem value={dept.departmentId || undefined} key={key}>
                      {dept.departmentName}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <InputLabel id="demo-simple-select-label"> Week</InputLabel>
          <FormControl style={{ minWidth: 300, height: 100 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label=""
              name="week"
              onChange={onChangeDept}
              value={selectedWeek}
            >
              {Object.entries(ConnectHistoryEnum).map(([key, val]) => {
                return (
                  <MenuItem value={key} key={key}>
                    {val}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <h3>Start Date</h3>
          <TextField
            name="startDate"
            id="date"
            label=""
            type="date"
            defaultValue="02/22/2022"
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ minWidth: 300, height: 100 }}
          />
        </Grid>
        <Grid item xs={3}>
          <h3>End Date</h3>
          <TextField
            name="endDate"
            id="date"
            label=""
            type="date"
            defaultValue="03/30/2023"
            onChange={(e) => onChangeDate(e)}
            required
            style={{ minWidth: 300, height: 100 }}
          />
        </Grid>
      </Grid>
      <Grid>
        {loading ? (
          <em>Loading...</em>
        ) : (
          <>
            {rowData && rowData !== null ? (
              <Grid container spacing={2}>
                <Box style={{ height: 600, width: '100%', margin: 2, marginBottom: 4 }}>
                  <DataGrid
                    rows={rowData}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    components={{
                      Toolbar: CustomToolbar,
                    }}
                  />
                </Box>
              </Grid>
            ) : (
              'No Data '
            )}
          </>
        )}
      </Grid>
    </div>
  );
}
