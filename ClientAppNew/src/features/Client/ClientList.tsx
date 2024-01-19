import React, { useState, useRef } from 'react';
import { Grid } from '@material-ui/core';
import DialogModel from 'common/Dialog';
import { GridColDef, GridAddIcon, GridArrowUpwardIcon, GridArrowDownwardIcon } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { clientSelector, isLoadingSelector } from 'selectors/client.selector';
import IconButton from '@material-ui/core/IconButton';
import { Status } from 'Enums/StatusEnum/Status';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import clientService from 'services/clientRequest';
import deptService from 'services/dept.Request';
import { roleSelector } from 'selectors/auth.selector';
import { USER_ROLE } from 'configs';
import DepartmentSelect from 'components/molecules/CustomSelect/DepartmentSelect/DepartmentSelect';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { ExportClient } from 'features/ExcelExport/ClientExport';
import { FaArrowUp } from 'react-icons/fa';
import { setLoading } from 'actions/app.action';
import AddClient from './AddClient';
import { IClients } from './ClientModel';
import DeleteClient from './DeleteClient';
import EditClient from './EditClient';
import useClientStyles from './client.styles';
import loadingImg from '../../assets/images/blue_loading.gif';

export default function ClientList() {
  const refFile = useRef<any>();
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(Status.ALL);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [client, setClient] = useState<IClients>();
  const [fileList, setFileList] = useState<FileList | null>(null);
  const clientData = useSelector(clientSelector);
  useSelector(isLoadingSelector);
  const loading: boolean = useSelector(isLoadingSelector);
  const classes = useClientStyles();
  const [selectedDept] = useState('all');

  const role = useSelector(roleSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;

  const columns: GridColDef[] = [
    {
      field: 'clientName',
      headerName: 'ClientName',
      editable: true,
      minWidth: 200,
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      editable: true,
      minWidth: 200,
    },
    {
      field: 'marketplaceName',
      headerName: 'Marketplace Name',
      editable: true,
      minWidth: 200,
    },
    {
      field: 'clientEmail',
      headerName: 'Email',
      editable: true,
      minWidth: 250,
    },
    {
      field: 'communication',
      headerName: 'Communication',
      editable: true,
      minWidth: 200,
    },
    {
      field: 'country',
      headerName: 'Country',
      editable: true,
      minWidth: 200,
    },
    // {
    //   field: 'isActive',
    //   headerName: 'Status',
    //   editable: true,
    //   minWidth: 150,
    //   renderCell: (rowData: any) => {
    //     return rowData.row.isActive === true ? 'Active' : 'InActive';
    //   },
    // },
    {
      field: 'accounts',
      headerName: 'Account Type',
      editable: true,
      minWidth: 200,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Department',
      sortable: false,
      minWidth: 100,
      hide: !isInRole,
      renderCell: (param: any) => {
        const onClickDelete = (): void => {
          const Id = param.row.clientId;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the client status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await clientService.deleteClient(Id);

              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(clientService.fetchClientList());
            }
          });
        };
        const onClick = async (): Promise<void> => {
          const response = await clientService.fetchClientById(param?.row.clientId);
          setIsOpenEdit(true);
          setClient(response?.data.client);
        };

        if (isInRole) {
          return (
            <>
              <IconButton color="primary" aria-label="edit" size="medium" onClick={onClick}>
                <EditIcon />
              </IconButton>
              {/* <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelete()}>
                <DeleteIcon />
              </IconButton> */}
            </>
          );
        }
        return <div>{/* if needed anything */}</div>;
      },
    },
  ];

  // const onChangeStatus = (e: any) => {
  //   let isStatus;
  //   if (e.target.name === 'clientStatus') {
  //     isStatus = e.target.value;
  //     setSelectedStatus(isStatus);
  //   }

  //   const statusFilter = isStatus === 'all' ? null : isStatus;
  //   let currentStatus;
  //   switch (statusFilter) {
  //     case 'Active':
  //       currentStatus = true;
  //       break;
  //     case 'Inactive':
  //       currentStatus = false;
  //       break;
  //     default:
  //       currentStatus = null;
  //       break;
  //   }
  //   if (currentStatus == null) {
  //     dispatch(clientService.fetchClientList());
  //   } else {
  //     dispatch(clientService.fetchClientsByStatus(currentStatus));
  //   }
  // };

  React.useEffect(() => {
    dispatch(deptService.fetchDepartmentList());
    if (clientData === null) {
      const deptFilter = selectedDept === 'all' ? null : selectedDept;
      dispatch(clientService.fetchClientList(deptFilter || null));
    }
  }, [dispatch]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenEdit(false);
    setIsOpenDelete(false);
  };

  const onChangeDept = (e: any) => {
    const dept = e?.target?.value;
    if (dept) {
      const deptFilter = dept === 'all' ? null : dept;
      dispatch(clientService.fetchClientList(deptFilter));
      localStorage.setItem('salaryDept', dept);
      // setSelectedDept(dept);
    }
  };
  const handelDownload = async () => {
    try {
      await clientService.downloadClientsSampleExcel();
    } catch (error) {
      throw Error();
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await clientService.ImportClient(e.target.files);
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

    dispatch(clientService.fetchClientList());
    setLoading(false);
    e.target.value = '';
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {isInRole && <DepartmentSelect value={selectedDept} onChange={onChangeDept} label="Department" />}
      </Grid>
      {isInRole ? (
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
          <div style={{ display: 'flex', justifyContent: 'end', columnGap: 10 }}>
            {/* <label
              htmlFor="actual-btn"
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '1rem',
                fontFamily: 'sans-serif',
                borderRadius: '0.3rem',
                cursor: 'pointer',
                marginLeft: '232px',
                verticalAlign: 'unset',
                display: 'inline',
                marginTop: '10px',
                maxHeight: '51px',
              }}
            >
              <FaArrowUp style={{ fontSize: '10px', marginRight: 3 }} />
              <input
                type="file"
                id="actual-btn"
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                hidden
              />
              Upload Excel
            </label> */}
            <PrimaryButton startIcon={<GridArrowUpwardIcon />} onClick={() => refFile?.current.click()}>
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
            {/* <ExportClient userDetail={clientData} Dynamiccolumn={columns} /> */}
            <PrimaryButton startIcon={<GridArrowDownwardIcon />} onClick={handelDownload}>
              Download Client Excel Sheet
            </PrimaryButton>
            <DialogModel
              open={isOpen}
              title="Add client"
              dialogContent={<AddClient handleClose={handleClose} isOpen={isOpen} />}
            />
            <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
              Add Client
            </SecondayButton>
          </div>
        </Grid>
      ) : (
        ''
      )}
      <Grid item xs={12}>
        {loading ? (
          <img className={classes.loader} src={loadingImg} alt="loding-img" />
        ) : (
          <>
            {clientData && clientData !== null && (
              <CustomDataGrid rows={clientData || []} columns={columns} getRowId={(row) => row?.clientId} loading={loading} />
            )}
          </>
        )}
      </Grid>
      <DialogModel
        open={isOpenEdit}
        title="Edit client"
        dialogContent={
          <EditClient isOpenEdit={isOpenEdit} client={client} selectedDept={selectedDept} handleCloseEdit={handleClose} />
        }
      />
      <DialogModel
        open={isOpenDelete}
        title="Delete client"
        dialogContent={<DeleteClient client={client} setIsOpenDelete={setIsOpenDelete} handleCloseDelete={handleClose} />}
      />
    </Grid>
  );
}
