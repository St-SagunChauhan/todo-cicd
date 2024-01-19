import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assetsSelector } from 'selectors/assets.selector';
import assetCategory from 'services/assetCategoryService';
import Swal from 'sweetalert2';
import assetsService from 'services/assetsServices';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { assetCategoriesSelector } from 'selectors/assetCategory.selector';
import { ManufacturerName } from 'Enums/IT-Assets/ManufacturerNameEnum';
import useClientStyles from './assets.style';

type IProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const assetValidationSchema = yup.object({
  assetName: yup.string().required('Asset Name is Required!'),
  categoryId: yup.string().required('Category Name is Required!'),
  quantity: yup.number().min(1, 'Minimum 1 Quantity Required!').required('Quantity is required!'),
  purchasedDate: yup.string().required('Purchase Date is required'),
  manufacturerName: yup.string().required('Manufacturer Name is required'),
});

export default function AddAssetsModel({ isOpen, handleClose }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const classes = useClientStyles();
  const categoryData = useSelector(assetCategoriesSelector);
  const [categoryDrop, setCategoryDrop] = useState<any[]>([]);
  const formik = useFormik({
    initialValues: {
      categoryId: '',
      assetName: '',
      identificationNumber: '',
      manufacturerName: '',
      purchasedDate: '',
      assetStatus: '',
      quantity: 0,
      modelNumber: '',
      remarks: '',
    },
    validationSchema: assetValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const response = await assetsService.addAsset(values);
      setLoading(false);
      handleClose();
      resetForm();
      dispatch(assetsService.fetchAssetsList(null, null));

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
    },
  });

  useEffect(() => {
    if (categoryData === null) {
      dispatch(assetCategory.fetchAssetCategoriesList());
    } else {
      const categoryList =
        categoryData?.length >= 0 &&
        categoryData.map((category: any, key: number) => ({
          label: category.categoryName,
          value: category.categoryId,
        }));
      setCategoryDrop(categoryList);
    }
  }, [categoryData]);

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
        <DialogTitle>
          <Typography variant="h5">Add Asset</Typography>
        </DialogTitle>
        <Divider />
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                id="assetName"
                {...formik.getFieldProps('assetName')}
                onChange={formik.handleChange}
                value={formik.values.assetName}
                label="Asset Name"
                variant="outlined"
                size="small"
                fullWidth
                error={Boolean(formik.errors.assetName && formik.touched.assetName)}
                helperText={formik.errors.assetName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Category Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category Name"
                  variant="outlined"
                  {...formik.getFieldProps('categoryId')}
                  error={Boolean(formik.errors.categoryId && formik.touched.categoryId)}
                  onChange={formik.handleChange}
                  value={formik.values.categoryId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {categoryDrop && categoryDrop?.length >= 0 ? (
                    categoryDrop.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="">--</MenuItem>
                  )}
                </Select>
                <FormHelperText style={{ color: formik.touched.categoryId ? 'red' : '' }}>
                  {formik.errors.categoryId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Manufacturer Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="outlined"
                  label="Billing Type"
                  {...formik.getFieldProps('manufacturerName')}
                  error={Boolean(formik.errors.manufacturerName && formik.touched.manufacturerName)}
                >
                  {Object.entries(ManufacturerName).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.manufacturerName ? 'red' : '' }}>
                  {formik.errors.manufacturerName}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="purchasedDate"
                {...formik.getFieldProps('purchasedDate')}
                onChange={formik.handleChange}
                value={formik.values.purchasedDate}
                type="date"
                label="Purchased Date"
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(formik.errors.purchasedDate && formik.touched.purchasedDate)}
                helperText={formik.errors.purchasedDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="quantity"
                {...formik.getFieldProps('quantity')}
                onChange={formik.handleChange}
                value={formik.values.quantity}
                label="Quantity"
                variant="outlined"
                size="small"
                fullWidth
                error={Boolean(formik.errors.quantity && formik.touched.quantity)}
                helperText={formik.errors.quantity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="modelNumber"
                {...formik.getFieldProps('modelNumber')}
                onChange={formik.handleChange}
                value={formik.values.modelNumber}
                label="Serial/Model Number"
                variant="outlined"
                size="small"
                fullWidth
                error={Boolean(formik.errors.modelNumber && formik.touched.modelNumber)}
                helperText={formik.errors.modelNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="remarks"
                {...formik.getFieldProps('remarks')}
                onChange={formik.handleChange}
                value={formik.values.remarks}
                label="Remarks"
                variant="outlined"
                size="small"
                fullWidth
                error={Boolean(formik.errors.remarks && formik.touched.remarks)}
                helperText={formik.errors.remarks}
              />
            </Grid>
          </Grid>
          <div className={classes.submitClose}>
            <Button className={classes.submitBtn} disabled={loading} color="primary" variant="contained" type="submit">
              {loading ? 'Please Wait...' : 'Submit'}
            </Button>
            <div className={classes.closeBtn}>
              <Button
                className={classes.submitBtn}
                disabled={loading}
                color="primary"
                variant="contained"
                onClick={() => handleClose()}
              >
                Close
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
}
