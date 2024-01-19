import React, { useEffect, useRef, useState } from 'react';
import { assetHandoverSelector, isLoadingSelector } from 'selectors/assetHandovered.selector';
import { Box, Grid, Button, FormControl, Select, MenuItem, IconButton, TextField } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridArrowDownwardIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid/index';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogModel from 'common/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { USER_ROLE } from 'configs';
import { roleSelector } from 'selectors/auth.selector';
import EnumSelect from 'components/molecules/CustomEnumFilter/CustomEnumFilter';
import Swal from 'sweetalert2';
import handoverassetsService from 'services/assetHandoverService';
import { assetsSelector } from 'selectors/assets.selector';
import { HandoverAssetStatus } from 'Enums/IT-Assets/HandoverAssetStatusEnum';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { empSelector } from 'selectors/emp.selector';
import empService from 'services/emp.Request';
import { IEmployee } from 'features/Employee/EmpModel';
import { setLoading } from 'actions/app.action';
import assetsServices from '../../../services/assetsServices';
import useHandoverAssetStyles from './handoverAsset.style';
import loadingImg from '../../../assets/images/blue_loading.gif';
import AddHandoverAssets from './AddHandoverAssets';
import EditHandoverAssets from './EditHandoverAssets';

export default function AssetsListData() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [editRow, setEditRow] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [assetNameFilter, setAssetNameFilter] = useState<any>('');
  const [handoverStatusFilter, setHandoverStatusFilter] = useState<any>('');
  const [assignedDateFilter, setAssignedDateFilter] = useState<any>('');
  const [dataRetrievalDateFilter, setDataRetrievalDateFilter] = useState<any>('');
  const [employeeNameFilter, setEmployeeNameFilter] = useState<any>('');
  const [asset, setAsset] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any[]>([]);
  const refFile = useRef<any>();

  const classes = useHandoverAssetStyles();
  const loading = useSelector(isLoadingSelector);
  const role = useSelector(roleSelector);
  const handoverassetsData = useSelector(assetHandoverSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;
  const dispatch = useDispatch();
  const assetData = useSelector(assetsSelector);
  const empData = useSelector(empSelector);

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const handoverAssetStatusFilter = event.target.value;
    if (handoverAssetStatusFilter === 'null') {
      dispatch(
        handoverassetsService.fetchAssetsHadnoverList(
          assetNameFilter,
          employeeNameFilter,
          null,
          assignedDateFilter,
          dataRetrievalDateFilter,
        ),
      );
      setHandoverStatusFilter(null);
    } else {
      dispatch(
        handoverassetsService.fetchAssetsHadnoverList(
          assetNameFilter,
          employeeNameFilter,
          handoverAssetStatusFilter,
          assignedDateFilter,
          dataRetrievalDateFilter,
        ),
      );
      setHandoverStatusFilter(event.target.value);
    }
  };

  const handelChangeAssetName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const assestNameFil = event.target.value;
    if (assestNameFil === 'all') {
      dispatch(
        handoverassetsService.fetchAssetsHadnoverList(
          null,
          employeeNameFilter,
          handoverStatusFilter,
          assignedDateFilter,
          dataRetrievalDateFilter,
        ),
      );
      setAssetNameFilter(null);
    } else {
      dispatch(
        handoverassetsService.fetchAssetsHadnoverList(
          assestNameFil,
          employeeNameFilter,
          handoverStatusFilter,
          assignedDateFilter,
          dataRetrievalDateFilter,
        ),
      );
      setAssetNameFilter(event.target.value);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const onChangeDate = (data: Record<string, string>) => {
    setDataRetrievalDateFilter(data?.endDate);
    setAssignedDateFilter(data?.startDate);

    dispatch(
      handoverassetsService.fetchAssetsHadnoverList(
        assetNameFilter,
        employeeNameFilter,
        handoverStatusFilter,
        data?.startDate,
        data?.endDate,
      ),
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await handoverassetsService.ImportHandoverAsset(e.target.files);
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
    dispatch(handoverassetsService.fetchAssetsHadnoverList());
    setLoading(false);
    e.target.value = '';
  };

  const handleEmployeeName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const employeeFilter = event.target.value;
    if (employeeFilter === 'all') {
      dispatch(
        handoverassetsService.fetchAssetsHadnoverList(
          assetNameFilter,
          null,
          handoverStatusFilter,
          assignedDateFilter,
          dataRetrievalDateFilter,
        ),
      );
      setEmployeeNameFilter(null);
    } else {
      dispatch(
        handoverassetsService.fetchAssetsHadnoverList(
          assetNameFilter,
          employeeFilter,
          handoverStatusFilter,
          assignedDateFilter,
          dataRetrievalDateFilter,
        ),
      );
      setEmployeeNameFilter(event.target.value);
    }
  };

  const handelDownload = async () => {
    try {
      await handoverassetsService.downloadHandoverAssetList();
    } catch (error) {
      throw Error();
    }
  };

  useEffect(() => {
    console.log(handoverassetsData);

    if (handoverassetsData === null && rowData === null) {
      dispatch(handoverassetsService.fetchAssetsHadnoverList(null, null, null, null, null));
    } else {
      const rows =
        handoverassetsData &&
        handoverassetsData.length >= 0 &&
        handoverassetsData.map((handoverAsset: any, index: number) => ({
          handoverId: handoverAsset.handoverId,
          assetName: handoverAsset.assetName,
          identificationNumber: handoverAsset.identificationNumber,
          quantity: handoverAsset.quantity,
          inStockAsset: handoverAsset.inStockAsset,
          assignedTo: handoverAsset.assignedTo,
          assignedDate: `${new Date(handoverAsset.assignedDate).getDate()}-${
            new Date(handoverAsset.assignedDate).getMonth() + 1
          }-${new Date(handoverAsset.assignedDate).getFullYear()}`,
          handoverStatus: handoverAsset.handoverStatus,
          remarks: handoverAsset.remarks,
        }));
      setRowData(rows);
    }
  }, [handoverassetsData]);

  useEffect(() => {
    if (assetData === null) {
      dispatch(assetsServices.fetchAssetsList());
    } else {
      const assetList =
        assetData && assetData.length >= 0 ? assetData.map((item: any) => ({ label: item.assetName, value: item.assetId })) : [];
      setAsset(assetList);
    }
    console.log(assetNameFilter);
  }, [assetData]);

  useEffect(() => {
    if (empData === null) {
      dispatch(empService.fetchEmpList());
    } else {
      const empList =
        empData && empData?.length > 0
          ? empData.map((emp: IEmployee) => ({ label: `${emp.firstName} ${emp.lastName}`, value: emp.employeeId }))
          : [{ label: 'No Employee Found', value: null }];
      setEmployee(empList);
    }
  }, [empData]);

  useEffect(() => {
    setAssetNameFilter(null);
    setAssignedDateFilter(null);
    setDataRetrievalDateFilter(null);
    setEmployeeNameFilter(null);
    setHandoverStatusFilter(null);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'assetName',
      headerName: 'Asset Name',
      minWidth: 280,
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      minWidth: 250,
      editable: true,
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      minWidth: 250,
      editable: true,
    },
    {
      field: 'inStockAsset',
      headerName: 'In Stock',
      minWidth: 250,
      editable: true,
    },
    {
      field: 'handoverStatus',
      headerName: 'Handover Status',
      minWidth: 280,
      editable: true,
    },
    {
      field: 'assignedDate',
      headerName: 'Assigned Date ',
      minWidth: 280,
      editable: true,
    },
    {
      field: 'identificationNumber',
      headerName: 'Identification Number',
      minWidth: 280,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Action',
      description: 'Edit Asset',
      minWidth: 100,
      hide: !isInRole,
      renderCell(params: any) {
        const onClickEditHandoverAsset = async (): Promise<void> => {
          const response = await handoverassetsService.getHandoverAssetById(params?.row.handoverId);
          console.log(response);

          setIsOpenEditModal(true);
          setEditRow(response?.handoverAssets);
        };
        const onClickDelHandoverAsset = (): void => {
          const handoverDataId = params.row.handoverId;
          console.log(params);

          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the Handover Asset Status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await handoverassetsService.deleteHandoverAsset(handoverDataId);
              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(handoverassetsService.fetchAssetsHadnoverList());
            }
          });
        };
        return (
          <>
            <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditHandoverAsset()}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelHandoverAsset()}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={1} className={classes.statusField}>
          <EnumSelect
            label="Status"
            enumObject={HandoverAssetStatus}
            value={handoverStatusFilter}
            onChange={handleStatusChange}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomSelect
            options={asset}
            value={assetNameFilter}
            onChange={handelChangeAssetName}
            id="category-select"
            loading={loading}
            label="Asset Name"
          />
        </Grid>
        <Grid item xs={2}>
          <CustomSelect
            options={employee}
            value={employeeNameFilter}
            onChange={handleEmployeeName}
            id="category-select"
            loading={loading}
            label="Employee Name"
          />
        </Grid>
        <Grid item xs={3}>
          <Box className={classes.header} style={{ display: 'flex', flexDirection: 'row-reverse', justifyItems: 'end' }}>
            <CustomDateRange
              onChange={onChangeDate}
              defaultValues={{ startDate: assignedDateFilter, endDate: dataRetrievalDateFilter }}
            />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <div>
            <SecondayButton
              startIcon={<GridAddIcon />}
              onClick={() => handleOpen()}
              style={{ minWidth: '150px', maxHeight: '50px', marginRight: '7px', marginTop: 0, marginLeft: 4 }}
            >
              Handover Asset
            </SecondayButton>
            {isInRole ? (
              <span>
                <SecondayButton
                  style={{ marginRight: '7px', maxWidth: '180px', padding: 10, marginTop: 0 }}
                  startIcon={<GridArrowDownwardIcon />}
                  onClick={handelDownload}
                >
                  Download Asset List
                </SecondayButton>
                <SecondayButton
                  onClick={() => refFile?.current.click()}
                  style={{ maxWidth: '180px', padding: 10, marginTop: 0 }}
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
              </span>
            ) : (
              ''
            )}
          </div>
          <DialogModel
            open={isOpen}
            title="HandoverAsset"
            dialogContent={<AddHandoverAssets handleCloseDialog={handleCloseDialog} isOpen={isOpen} />}
          />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <>
              {loading ? (
                <img className={classes.loader} src={loadingImg} alt="loading-img" />
              ) : (
                <>
                  {rowData && rowData !== null && (
                    <CustomDataGrid
                      rows={rowData || []}
                      columns={columns}
                      getRowId={(row) => row?.handoverId}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </>
            <DialogModel
              open={isOpenEditModal}
              title="Edit Asset"
              dialogContent={<EditHandoverAssets isOpen={isOpenEditModal} data={editRow} handleCloseDialog={handleCloseDialog} />}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
