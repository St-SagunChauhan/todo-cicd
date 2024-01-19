import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Grid, InputLabel, TextField, Dialog, DialogTitle, Typography, Divider } from '@material-ui/core';
import Swal from 'sweetalert2';
import { useEmpStyles } from 'features/Employee/emp.styles';
import authService from 'services/authService';

type props = {
  handleClose: () => void;
  isOpen: boolean;
  user: any;
};

const empValidation = yup.object({
  password: yup.string().required('Password is required'),
  newPassword: yup.string().required('Confirm Password is required'),
});

export default function ChangePassword({ handleClose, isOpen, user }: props) {
  const classes = useEmpStyles();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      id: user?.employeeId,
    },

    validationSchema: empValidation,
    onSubmit: async (values, { resetForm }) => {
      if (values.password !== values.newPassword) {
        setError(true);
      } else {
        setError(false);
        setLoading(true);
        const response = await authService.changePassword(values);
        setLoading(false);
        resetForm();
        handleClose();

        if (!response.data.success) {
          Swal.fire({
            customClass: {
              popup: 'alertBottomRight',
              container: 'changePasswordPopup',
            },
            position: 'center',
            icon: 'error',
            title: response.data.message,
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          Swal.fire({
            customClass: 'alertBottomRight',
            position: 'center',
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    },
  });
  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Change Password
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromClientDetails">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputLabel className="">New Password</InputLabel>
              <TextField type="password" fullWidth {...formik.getFieldProps('password')} error={!!formik.errors.password} />
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.password}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel className="">Confirm Password</InputLabel>
              <TextField type="password" fullWidth {...formik.getFieldProps('newPassword')} error={!!formik.errors.newPassword} />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.newPassword}</div>
                </div>
              )}
              {errorMsg && <p style={{ color: 'red' }}>Confirm password is not matched</p>}
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
          </Grid>
        </form>
      </div>
    </Dialog>
  );
}
