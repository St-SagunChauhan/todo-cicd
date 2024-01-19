import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Button, Grid, TextField, DialogActions, DialogTitle, Typography, Divider } from '@material-ui/core';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import deptService from 'services/dept.Request';
import { deptSelector } from 'selectors/dept.selector';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { GridAddIcon, GridCloseIcon } from '@mui/x-data-grid';
import { deptStyle } from './dept.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
};

const validationSchema = yup.object({
  departmentName: yup.string().trim().required('Department name is required!'),
});

export default function EditDeptModel({ isOpen, handleCloseDialog, data }: IProps): JSX.Element {
  const [msg, setMsg] = useState('');
  const classes = deptStyle();
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const [errorMsg, setErrorMsg] = useState();

  const formik = useFormik({
    initialValues: {
      departmentName: data?.departmentName,
      departmentId: data?.departmentId,
      isActive: true,
    },

    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const IsDepartmentexists = deptData.some(
        (x: { departmentName: string }) => x.departmentName.toUpperCase() === values.departmentName.toUpperCase(),
      );
      setErrorMsg(IsDepartmentexists);
      if (!IsDepartmentexists) {
        const response = await deptService.updateDepartment(values);
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
          Update department name
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {data.departmentName !== '' && (
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Department Name"
                  {...formik.getFieldProps('departmentName')}
                  onChange={formik.handleChange}
                  value={msg === '' ? formik.values.departmentName : ''}
                  onClick={() => setMsg('')}
                  error={Boolean(formik.errors.departmentName && formik.touched.departmentName)}
                  helperText={formik.errors.departmentName}
                />
              )}
              {errorMsg && <p style={{ color: 'red' }}>Department Alredy exists</p>}
            </Grid>
          </Grid>

          <DialogActions>
            <Grid item xs={12} md={5}>
              <PrimaryButton startIcon={<GridAddIcon />} type="submit">
                Edit Department
              </PrimaryButton>
            </Grid>
            <Grid item xs={4} md={5}>
              <SecondayButton startIcon={<GridCloseIcon />} onClick={handleCloseDialog}>
                Close
              </SecondayButton>
            </Grid>
          </DialogActions>
          <Grid item xs={12}>
            {msg !== '' && <p>New department added successfully!</p>}
          </Grid>
        </form>
      </div>
    </Dialog>
  );
}
