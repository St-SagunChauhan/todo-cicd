import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { GridAddIcon, GridCloseIcon } from '@mui/x-data-grid';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { assetCategoriesSelector } from 'selectors/assetCategory.selector';
import { Dialog, DialogTitle, Divider, Grid, TextField, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import assetCategory from 'services/assetCategoryService';
import { assetCategoryStyle } from './assetCategory.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

const validationSchema = yup.object({
  categoryName: yup.string().required('Category name is required!'),
});

const AddAssetsCategory = ({ isOpen, handleCloseDialog }: IProps): JSX.Element => {
  const categoryData = useSelector(assetCategoriesSelector);
  const classes = assetCategoryStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const IsCategoryexists = categoryData.some(
        (x: { categoryName: string }) => x.categoryName.toUpperCase() === values.categoryName.toUpperCase(),
      );
      setErrorMsg(IsCategoryexists);
      if (!IsCategoryexists) {
        const response = await assetCategory.addAssetCategory(values);
        setLoading(true);

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
          Add a new Asset Category
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
                value={formik.values.categoryName}
                error={Boolean(formik.errors.categoryName && formik.touched.categoryName)}
                helperText={formik.errors.categoryName}
              />
              {errorMsg && <p style={{ color: 'red' }}>Category Alredy exists</p>}
            </Grid>
          </Grid>
          <div className={classes.submitClose}>
            <PrimaryButton startIcon={<GridAddIcon />} type="submit">
              {loading ? 'Please Wait...' : 'Add Asset Category'}
            </PrimaryButton>
            <div className={classes.closeBtn}>
              <SecondayButton startIcon={<GridCloseIcon />} onClick={handleCloseDialog}>
                Close
              </SecondayButton>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default AddAssetsCategory;
