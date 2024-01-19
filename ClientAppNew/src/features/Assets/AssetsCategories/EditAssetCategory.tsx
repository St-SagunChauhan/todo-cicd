import React, { useState } from 'react';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { assetCategoriesSelector } from 'selectors/assetCategory.selector';
import { useFormik } from 'formik';
import assetCategory from 'services/assetCategoryService';
import Swal from 'sweetalert2';
import { Dialog, DialogActions, DialogTitle, Divider, Grid, TextField, Typography } from '@material-ui/core';
import { GridAddIcon, GridCloseIcon } from '@mui/x-data-grid';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { assetCategoryStyle } from './assetCategory.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
};

const validationSchema = yup.object({
  categoryName: yup.string().required('Category name is required!'),
});

export default function EditAssetsCategory({ isOpen, handleCloseDialog, data }: IProps): JSX.Element {
  const [msg, setMsg] = useState('');
  const classes = assetCategoryStyle();
  const dispatch = useDispatch();
  const assetCategoryData = useSelector(assetCategoriesSelector);
  const [errorMsg, setErrorMsg] = useState();

  const formik = useFormik({
    initialValues: {
      categoryId: data?.categoryId,
      categoryName: data.categoryName,
      isActive: true,
    },

    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const IsAssetCategoryexists = assetCategoryData.some(
        (x: { categoryName: string }) => x.categoryName.toUpperCase() === values.categoryName.toUpperCase(),
      );
      setErrorMsg(IsAssetCategoryexists);
      if (!IsAssetCategoryexists) {
        const response = await assetCategory.updateAssetCategory(values);
        handleCloseDialog();
        resetForm();
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

        dispatch(assetCategory.fetchAssetCategoriesList());
      }
    },
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Update Asset Category Name
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewAssetCategory">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Category Name"
                {...formik.getFieldProps('categoryName')}
                onChange={formik.handleChange}
                value={msg === '' ? formik.values.categoryName : ''}
                onClick={() => setMsg('')}
                error={Boolean(formik.errors.categoryName && formik.touched.categoryName)}
                helperText={formik.errors.categoryName}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Grid item xs={12} md={5}>
              <PrimaryButton startIcon={<GridAddIcon />} type="submit">
                Edit Asset Category
              </PrimaryButton>
            </Grid>
            <Grid item xs={4} md={5}>
              <SecondayButton startIcon={<GridCloseIcon />} onClick={handleCloseDialog}>
                Close
              </SecondayButton>
            </Grid>
          </DialogActions>
          <Grid item xs={12}>
            {msg !== '' && <p>New Category added successfully!</p>}
          </Grid>
        </form>
      </div>
    </Dialog>
  );
}
