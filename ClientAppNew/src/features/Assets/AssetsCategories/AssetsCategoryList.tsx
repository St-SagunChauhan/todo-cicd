import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assetCategoriesSelector, isLoadingSelector } from 'selectors/assetCategory.selector';
import assetCategory from 'services/assetCategoryService';
import { GridAddIcon, GridColDef } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { Grid, IconButton } from '@material-ui/core';
import DialogModel from 'common/Dialog';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import loadingImg from '../../../assets/images/blue_loading.gif';
import AddAssetCategories from './AddAssetCategories';
import EditAssetsCategory from './EditAssetCategory';
import { assetCategoryStyle } from './assetCategory.style';

export default function AssetsCategoryList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [cateList, setCateList] = useState([]);
  const dispatch = useDispatch();
  const categoryData = useSelector(assetCategoriesSelector);
  const loading: boolean = useSelector(isLoadingSelector);
  const classes = assetCategoryStyle();

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    dispatch(assetCategory.fetchAssetCategoriesList());
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'categoryName',
      headerName: 'Category Name',
      flex: 1,
      editable: true,
    },
    {
      renderCell: (rowData: any) => {
        return rowData.row.isActive ? 'Active' : 'Inactive';
      },
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove Asset Category',
      flex: 0.5,
      sortable: false,
      align: 'left',
      renderCell: (param: any) => {
        const onClickDelAssetCategory = (): void => {
          console.log(param.row);

          // const categoryId = param.row.categoryId;
          const { categoryId } = param.row;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the Asset Category status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await assetCategory.deleteAssetCategory(categoryId);
              if (response.status === 200) {
                Swal.fire('Asset Category Deleted Successfully');
              } else {
                Swal.fire('Error', response.message);
              }

              dispatch(assetCategory.fetchAssetCategoriesList());
            }
          });
        };

        const onClickEditCategory = async (): Promise<void> => {
          const response = await assetCategory.fetchAssetCategoryById(param?.row.categoryId);

          setIsOpenEditModal(true);
          setEditRow(response?.data.assetCategories);
        };

        return (
          <>
            <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditCategory()}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" ria-label="delete" size="medium" onClick={() => onClickDelAssetCategory()}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end', marginBottom: '15px' }}>
        <DialogModel
          open={isOpen}
          title="Add Asset Category"
          dialogContent={<AddAssetCategories handleCloseDialog={handleCloseDialog} isOpen={isOpen} />}
        />

        <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
          Add Asset Category
        </SecondayButton>
      </Grid>

      <Grid item xs={12}>
        {loading ? (
          <img className={classes.loader} src={loadingImg} alt="loding-img" />
        ) : (
          <>
            {categoryData && categoryData !== null && (
              <CustomDataGrid rows={categoryData || []} columns={columns} getRowId={(row) => row?.categoryId} loading={loading} />
            )}
          </>
        )}
      </Grid>

      {isOpenEditModal && (
        <DialogModel
          open={isOpenEditModal}
          title="Edit Asset Category"
          dialogContent={<EditAssetsCategory data={editRow} handleCloseDialog={handleCloseDialog} isOpen={isOpenEditModal} />}
        />
      )}
    </div>
  );
}
