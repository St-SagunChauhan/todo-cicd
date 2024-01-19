import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Button, Grid, TextField, DialogTitle, Typography, Divider } from '@material-ui/core';
import { useFormik } from 'formik';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import expenseCategoryService from 'services/expenseCategory.Request';
import { ExpenseCategoryStyle } from './ExpenseCategory.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  expenseCategoryData: any;
};

const validationSchema = yup.object({
  categoryName: yup.string().required('Category name is required!'),
});

export default function AddClient({ isOpen, handleCloseDialog, expenseCategoryData }: IProps): JSX.Element {
  const classes = ExpenseCategoryStyle();
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
      // const IsExpenseCategoryexists = expenseCategoryData.some(
      //   (x: { categoryName: string }) => x.categoryName === values.categoryName,
      // );
      // setErrorMsg(IsExpenseCategoryexists);
      // if (!IsExpenseCategoryexists) {
      const response = await expenseCategoryService.addNewExpenseCategory(values);
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
      dispatch(expenseCategoryService.fetchExpenseCategoryList());
      // }
    },
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add new Expense Category
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewExpenseCategory">
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
            </Grid>
          </Grid>
          <div className={classes.submitClose}>
            <PrimaryButton startIcon={<GridAddIcon />} type="submit">
              {loading ? 'Please Wait...' : 'Submit'}
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
}
