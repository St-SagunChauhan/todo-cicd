import React, { useEffect, useRef, useState } from 'react';
import { assetsSelector, isLoadingSelector } from 'selectors/assets.selector';
import { Box, Grid, Button, FormControl, Select, MenuItem, IconButton } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridArrowDownwardIcon, GridArrowUpwardIcon, GridColDef } from '@mui/x-data-grid/index';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import CustomSelect from 'components/molecules/CustomSelect/CustomSelect';
import EditIcon from '@material-ui/icons/Edit';
import DialogModel from 'common/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { USER_ROLE } from 'configs';
import { roleSelector } from 'selectors/auth.selector';
import { ManufacturerName } from 'Enums/IT-Assets/ManufacturerNameEnum';
import EnumSelect from 'components/molecules/CustomEnumFilter/CustomEnumFilter';
import { assetCategoriesSelector } from 'selectors/assetCategory.selector';
import assetCategory from 'services/assetCategoryService';
import Swal from 'sweetalert2';
import { setLoading } from 'actions/app.action';
import assetsServices from '../../../services/assetsServices';
import useClientStyles from './assets.style';
import loadingImg from '../../../assets/images/blue_loading.gif';
import EditAssetsModel from './EditAssetsModel';
import AddAssetModel from './AddAssetsModel';

export default function AssetsListData() {
  const refFile = useRef<any>();
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [startDates, setStartDate] = useState<any>('');
  const [currentDates, setcurrentDate] = useState<any>('');
  const [selectedStatus, setSelectedStatus] = useState<any>('');
  const [manufacturerFilter, setManufacturerFilter] = useState<any>('');
  const [categoryNameFilter, setCategoryFilter] = useState<any>('all');
  const [category, setCategory] = useState<any[]>([]);
  const classes = useClientStyles();
  const loading = useSelector(isLoadingSelector);
  const role = useSelector(roleSelector);
  const assetsData = useSelector(assetsSelector);
  const isInRole = role === USER_ROLE.ADMIN;
  const dispatch = useDispatch();
  const categoryData = useSelector(assetCategoriesSelector);

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const assetsStatusFil = event.target.value;
    if (assetsStatusFil === 'all') {
      dispatch(assetsServices.fetchAssetsList(startDates, currentDates, null, manufacturerFilter, categoryNameFilter));
    } else {
      dispatch(assetsServices.fetchAssetsList(startDates, currentDates, assetsStatusFil, manufacturerFilter, categoryNameFilter));
    }
    setSelectedStatus(event.target.value);
  };

  const handelChangeManuFacture = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const assestManuFil = event.target.value;
    if (assestManuFil === 'ALL') {
      dispatch(assetsServices.fetchAssetsList(startDates, currentDates, selectedStatus, null, categoryNameFilter));
    } else {
      dispatch(assetsServices.fetchAssetsList(startDates, currentDates, selectedStatus, assestManuFil, categoryNameFilter));
    }
    setManufacturerFilter(event.target.value);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const onChangeDate = (data: Record<string, string>) => {
    setcurrentDate(data?.endDate);
    setStartDate(data?.startDate);

    dispatch(assetsServices.fetchAssetsList(data?.startDate, data?.endDate, manufacturerFilter, selectedStatus));
  };

  const handleCategoryName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const categoryFilter = event.target.value;
    if (categoryFilter === 'all') {
      dispatch(assetsServices.fetchAssetsList(startDates, currentDates, selectedStatus, manufacturerFilter, null));
      setCategoryFilter(null);
    } else {
      dispatch(assetsServices.fetchAssetsList(startDates, currentDates, selectedStatus, manufacturerFilter, categoryFilter));
      setCategoryFilter(event.target.value);
    }
  };

  const handelDownload = async () => {
    try {
      await assetsServices.downloadAssetList();
    } catch (error) {
      throw Error();
    }
  };

  useEffect(() => {
    if (assetsData === null && rowData === null) {
      dispatch(assetsServices.fetchAssetsList(null, null, null, null));
    } else {
      const rows =
        assetsData &&
        assetsData.length >= 0 &&
        assetsData.map((asset: any, index: number) => ({
          assetId: asset.assetId,
          categoryName: asset.categoryName,
          assetName: asset.assetName,
          manufacturerName: asset.manufacturerName,
          purchasedDate: `${new Date(asset.purchasedDate).getDate()}-${new Date(asset.purchasedDate).getMonth() + 1}-${new Date(
            asset.purchasedDate,
          ).getFullYear()}`,
          modelNumber: asset.modelNumber,
          quantity: asset.quantity,
          remarks: asset.remarks,
        }));
      setRowData(rows);
    }
  }, [assetsData]);

  useEffect(() => {
    if (categoryData === null) {
      dispatch(assetCategory.fetchAssetCategoriesList());
    } else {
      const cateList =
        categoryData && categoryData.length >= 0
          ? categoryData.map((item: any) => ({ label: item.categoryName, value: item.categoryId }))
          : [];
      setCategory(cateList);
    }
    console.log(categoryNameFilter);
  }, [categoryData]);

  useEffect(() => {
    setCategoryFilter(null);
    setSelectedStatus(null);
    setManufacturerFilter(null);
    setcurrentDate(null);
    setStartDate(null);
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
      minWidth: 280,
      editable: true,
    },
    {
      field: 'manufacturerName',
      headerName: 'Manufacturer Name',
      minWidth: 280,
      editable: true,
    },
    {
      field: 'modelNumber',
      headerName: 'Serial/Model Number',
      minWidth: 280,
      editable: true,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
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
        const onClickEditProject = async (): Promise<void> => {
          const asset = await assetsServices.getAssetById(params?.row.assetId);
          setIsOpenEditModal(true);
          setEditRow(asset);
        };
        return (
          <>
            <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditProject()}>
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);
    const response = await assetsServices.ImportAsset(e.target.files);
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
    dispatch(assetsServices.fetchAssetsList());
    setLoading(false);
    e.target.value = '';
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <EnumSelect
            label="Manufacturer
            "
            enumObject={ManufacturerName}
            value={manufacturerFilter}
            onChange={handelChangeManuFacture}
          />
        </Grid>
        <Grid item xs={3}>
          <Box className={classes.header} style={{ display: 'flex', flexDirection: 'row-reverse', justifyItems: 'end' }}>
            <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: currentDates }} />
          </Box>
        </Grid>
        <Grid item xs={7}>
          <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyItems: 'end', columnGap: 6 }}>
            <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()} style={{ maxHeight: '43px' }}>
              Add Asset
            </SecondayButton>
            {isInRole ? (
              <Grid alignItems="center" xs={11} style={{ display: 'flex', justifyContent: 'end' }}>
                <Box mb={1}>
                  <SecondayButton startIcon={<GridArrowDownwardIcon />} onClick={handelDownload}>
                    Download Asset List
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
          </div>
          <DialogModel
            open={isOpen}
            title="Add Asset"
            dialogContent={<AddAssetModel handleClose={handleCloseDialog} isOpen={isOpen} />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loading ? (
            <img className={classes.loader} src={loadingImg} alt="loading-img" />
          ) : (
            <>
              {rowData && rowData !== null && (
                <CustomDataGrid rows={rowData || []} columns={columns} getRowId={(row) => row?.assetId} loading={loading} />
              )}
            </>
          )}
          <DialogModel
            open={isOpenEditModal}
            title="Edit Asset"
            dialogContent={<EditAssetsModel isOpen={isOpenEditModal} data={editRow} handleClose={handleCloseDialog} />}
          />
        </Grid>
      </Grid>
    </>
  );
}
