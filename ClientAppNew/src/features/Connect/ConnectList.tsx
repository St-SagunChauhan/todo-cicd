import React, { useRef, useState } from 'react';
import { Box, Grid, Button, TextField, FormControl, Select, MenuItem } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import connectService from 'services/connect.Request';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Swal from 'sweetalert2';
import { ExportToExcel } from 'features/ExcelExport/excleDownload';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import DialogModel from 'common/Dialog';
import { connectSelector, isLoadingSelector } from 'selectors/connect.selector';
import { roleSelector } from 'selectors/auth.selector';
import { USER_ROLE } from 'configs';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { deptSelector } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
import { setLoading } from 'actions/app.action';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridColDef, GridCheckIcon, GridCloseIcon, GridArrowUpwardIcon } from '@mui/x-data-grid';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import loadingImg from '../../assets/images/blue_loading.gif';
import AddConnectModal from './AddConnectModal';
import EditConnectModel from './EditConnectModel';
import { connectStyle } from './connect.style';

export default function ConnectList() {
  const refFile = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const dispatch = useDispatch();
  const connectData = useSelector(connectSelector);
  console.log('connectData', connectData);
  const classes = connectStyle();
  useSelector(isLoadingSelector);
  const [selectedDept, setSelectedDept] = useState('all');
  const deptData = useSelector(deptSelector);

  const loading: boolean = useSelector(isLoadingSelector);
  const role = useSelector(roleSelector);

  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;
  const [startDates, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    const deptFilter = selectedDept === 'all' ? null : selectedDept;
    dispatch(connectService.fetchConnectList(deptFilter || null));
  }, []);

  const onChangeStartDate = async (e: any) => {
    const startDate = e.target.value;
    setStartDate(startDate);

    const dayOfWeek = 5;
    const date = new Date(startDate);
    const diff = date.getDay() - dayOfWeek;
    if (diff > 0) {
      date.setDate(date.getDate() + 6);
    } else if (diff < 0) {
      date.setDate(date.getDate() + -1 * diff);
    }
    dispatch(connectService.fetchConnectList());
  };

  const columns: GridColDef[] = [
    {
      field: 'connectUsed',
      headerName: 'Connect Used',
      flex: 0.4,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'jobUrl',
      headerName: 'JobURL',
      flex: 1,
      minWidth: 210,
      editable: true,
    },
    {
      field: 'marketPlaceAccountName',
      headerName: 'Profile Name',
      flex: 1,
      minWidth: 210,
      editable: true,
    },
    {
      field: 'firstName',
      headerName: 'Employee Name',
      flex: 0.5,
      minWidth: 210,
      editable: true,
      renderCell: (param: any) => {
        return `${param.row.firstName} ${param.row.lastName}`;
      },
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      flex: 0.5,
      minWidth: 210,
      editable: true,
      renderCell: (param: any) => {
        return param.row.departmentName;
      },
    },
    {
      field: 'connect_Date',
      headerName: 'Connect Date',
      flex: 0.5,
      minWidth: 210,
      editable: true,
      renderCell: (param: any) => {
        return moment(param?.row.connect_Date).format('YYYY-MM-DD');
      },
    },
    {
      field: 'bidStatus',
      headerName: 'Status',
      flex: 0.5,
      minWidth: 210,
      editable: true,
      renderCell: (param: any) => {
        return param.row.bidStatus;
      },
    },
    {
      field: 'dealsWon',
      headerName: 'Deals Won',
      flex: 0.4,
      minWidth: 210,
      editable: true,
    },
    {
      field: 'marketingQualifiedLeads',
      headerName: 'Marketing Qualified Leads',
      flex: 0.4,
      minWidth: 210,
      editable: true,
    },
    {
      field: 'salesQualifiedLeads',
      headerName: 'Sales Qualified Leads',
      flex: 0.4,
      minWidth: 210,
      editable: true,
    },
    {
      field: 'technology',
      headerName: 'Technology',
      flex: 0.4,
      minWidth: 210,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Action',
      description: 'Edit and Remove Department',
      sortable: false,
      flex: 0.3,
      minWidth: 70,
      hide: !isInRole,
      renderCell: (param: any) => {
        const onClickEditConnect = async (): Promise<void> => {
          const response = await connectService.fetchConnectById(param?.row.connectId);
          setIsOpenEditModal(true);
          setEditRow(response?.data.connectModel);
        };

        if (isInRole) {
          return (
            <>
              <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditConnect()}>
                <EditIcon />
              </IconButton>
            </>
          );
        }
        return <div>{/* if needed anything */}</div>;
      },
    },
  ];

  // React.useEffect(() => {
  //   dispatch(connectService.fetchConnectList());
  // }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const response = await connectService.createConnectReport(e.target.files);
    setLoading(false);

    e.target.value = '';

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
    dispatch(connectService.fetchConnectList());
  };
  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    const deptFilter = dept === 'all' ? null : dept;
    dispatch(connectService.fetchConnectList(deptFilter));
  };
  const handelDownload = async () => {
    try {
      await connectService.downloadConnectsSampleExcel();
    } catch (error) {
      throw Error();
    }
  };
  return (
    <div>
      <>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={6} className={classes.header}>
            {isInRole && <DepartmentSelect value={selectedDept} onChange={onChangeDept} label="Department" />}
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end', columnGap: 10 }}>
            <PrimaryButton
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
            </PrimaryButton>

            {/* <Box sx={{ marginRight: '10px', marginTop: '1px' }}>
              <ExportToExcel userDetail={connectData} Dynamiccolumn={columns} />
            </Box> */}
            <DialogModel
              open={isOpen}
              title="Add Connect"
              dialogContent={<AddConnectModal handleCloseDialog={handleCloseDialog} isOpen={isOpen} />}
            />
            <PrimaryButton startIcon={<GridAddIcon />} onClick={handelDownload}>
              Download Connects Sample Excel
            </PrimaryButton>
            <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
              Add Connect
            </SecondayButton>
          </Grid>

          <Grid item xs={12}>
            {loading ? (
              <img className={classes.loader} src={loadingImg} alt="loding-img" />
            ) : (
              <>
                {connectData && connectData !== null && (
                  <CustomDataGrid
                    rows={connectData || []}
                    columns={columns}
                    getRowId={(row) => row?.connectId}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>

        <AddConnectModal isOpen={isOpen} handleCloseDialog={handleCloseDialog} />
        {isOpenEditModal && editRow && (
          <DialogModel
            open={isOpenEditModal}
            title="Edit client"
            dialogContent={
              <EditConnectModel
                data={editRow}
                selectedDept={selectedDept}
                handleCloseDialog={handleCloseDialog}
                isOpen={isOpenEditModal}
              />
            }
          />
        )}
      </>
    </div>
  );
}
