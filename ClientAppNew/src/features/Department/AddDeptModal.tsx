import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Button, Grid, TextField, DialogTitle, Typography, Divider } from '@material-ui/core';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import deptService from 'services/dept.Request';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { GridAddIcon, GridCloseIcon } from '@mui/x-data-grid';
import { deptStyle } from './dept.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  deptData: any;
};

const validationSchema = yup.object({
  departmentName: yup.string().trim().required('Department name is required!'),
});

export default function AddClient({ isOpen, handleCloseDialog, deptData }: IProps): JSX.Element {
  const classes = deptStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const formik = useFormik({
    initialValues: {
      departmentName: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const IsDepartmentexists = deptData.some(
        (x: { departmentName: string }) => x.departmentName.toUpperCase() === values.departmentName.toUpperCase(),
      );
      setErrorMsg(IsDepartmentexists);
      if (!IsDepartmentexists) {
        const response = await deptService.addNewDept(values);
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
        dispatch(deptService.fetchDepartmentList());
      }
    },
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new department
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Department Name"
                {...formik.getFieldProps('departmentName')}
                onChange={formik.handleChange}
                value={formik.values.departmentName}
                error={Boolean(formik.errors.departmentName && formik.touched.departmentName)}
                helperText={formik.errors.departmentName}
              />
              {errorMsg && <p style={{ color: 'red' }}>Department Alredy exists</p>}
            </Grid>
          </Grid>
          <div className={classes.submitClose}>
            <PrimaryButton startIcon={<GridAddIcon />} type="submit">
              {loading ? 'Please Wait...' : 'Add Department'}
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
