import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  Button,
  Grid,
  TextField,
  DialogTitle,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Divider,
  FormHelperText,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import authService from 'services/authService';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import { AddLeaveStatusEnum, LeaveTypeEnum } from 'Enums/LeaveEnum/LeaveEnum';
import { empSelector } from 'selectors/emp.selector';
import leaveService from 'services/leave.Request';
import moment from 'moment';
import { leaveStyle } from './leave.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};
const userInfo: any = JSON.parse(authService.getUser());
const validationSchema = yup.object({
  leaveType: yup.string().required('Leave type is required!'),
  status: yup.string().required('Status is required!'),
  reason: yup.string().required('Reason is required!'),
  startDate: yup.date().required('Start Date is required!'),
  endDate: yup.date().min(yup.ref('startDate'), 'Start Date should be older then End Date '),
});

export default function AddLeaveModal({ isOpen, handleCloseDialog }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const empData = useSelector(empSelector);
  const classes = leaveStyle();

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      leaveType: '',
      status: '',
      startDate: '' || '',
      reason: '',
      endDate: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (userInfo?.employeeId) {
        values.employeeId = userInfo?.employeeId;
      }
      setLoading(true);
      const response = await leaveService.addNewLeave(values);

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

      dispatch(leaveService.fetchLeaveList());
    },
  });

  const handleLeaveTypeChange = (e: any, value: any) => {
    formik.setFieldValue('leaveType', e.target.value);
    if (e.target.value === 'HalfDay' || e.target.value === 'ShortLeave') {
      const toDate = new Date();
      formik.setFieldValue('startDate', toDate);
      formik.setFieldValue('endDate', toDate);
    }
  };

  const isSatus = formik.values.leaveType === 'HalfDay' || formik.values.leaveType === 'ShortLeave';
  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Leave
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="addConnectModal">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                label="UserEmail"
                value={userInfo?.email}
                disabled
                InputProps={{
                  style: { color: 'darkslategray' },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ color: formik.errors.leaveType && formik.touched.leaveType ? 'red' : '' }}
                  id="demo-simple-select-leaveId"
                >
                  Leave Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-leaveId"
                  id="demo-select-leaveId"
                  // {...formik.getFieldProps('leaveType')}
                  onChange={handleLeaveTypeChange}
                  error={Boolean(formik.errors.leaveType && formik.touched.leaveType)}
                  label="leaveType"
                  value={formik.values.leaveType}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {Object.entries(LeaveTypeEnum).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.leaveType ? 'red' : '' }}>
                  {formik.errors.leaveType}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ color: formik.errors.status && formik.touched.status ? 'red' : '' }}
                  id="demo-simple-select-statusId"
                >
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-statusId"
                  id="demo-select-statusId"
                  {...formik.getFieldProps('status')}
                  error={Boolean(formik.errors.status && formik.touched.status)}
                  label="status"
                  value={formik.values.status}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {Object.entries(AddLeaveStatusEnum).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.status ? 'red' : '' }}>{formik.errors.status}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                label="Reason"
                {...formik.getFieldProps('reason')}
                error={Boolean(formik.errors.reason && formik.touched.reason)}
                helperText={formik.errors.reason}
                onChange={formik.handleChange}
                value={formik.values.reason}
                multiline
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            {!isSatus ? (
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  id="startDate"
                  fullWidth
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  {...formik.getFieldProps('startDate')}
                  error={Boolean(formik.errors.startDate && formik.touched.startDate)}
                  onChange={formik.handleChange}
                  value={formik.values.startDate}
                  InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}
                />
              </Grid>
            ) : (
              ''
            )}

            {!isSatus ? (
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  id="endDate"
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('endDate')}
                  error={Boolean(formik.errors.endDate && formik.touched.endDate)}
                  helperText={formik.errors.endDate}
                  onChange={formik.handleChange}
                  value={formik.values.endDate}
                />
              </Grid>
            ) : (
              ''
            )}
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
