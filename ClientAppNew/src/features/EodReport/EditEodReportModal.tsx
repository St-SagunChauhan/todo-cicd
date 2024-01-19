import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  Button,
  Grid,
  TextField,
  DialogTitle,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@material-ui/core';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';

import { deptSelector } from 'selectors/dept.selector';
import { empSelector } from 'selectors/emp.selector';
import { projectSelector } from 'selectors/project.selector';
import eodReportService from 'services/eodReportRequest';
import { eodReportStyle } from './eodReport.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
};

const validationSchema = yup.object({
  projectId: yup.string().required('Market Place is required!'),
  employeeId: yup.string().required('Employee Name is required!'),
  departmentId: yup.string().required('Department Name is required!'),
});

export default function EditEodReportModal({ isOpen, handleCloseDialog, data }: IProps): JSX.Element {
  const classes = eodReportStyle();
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const empdata = useSelector(empSelector);
  const projectData = useSelector(projectSelector);

  const formik = useFormik({
    initialValues: {
      eodReportId: data.eodReportId ?? '',
      departmentId: data?.departmentId ?? '',
      employeeId: data?.employeeId ?? '',
      projectId: data?.projectId ?? '',
      billingHours: data?.billingHours ?? 0,
      employeeDelightHours: data?.employeeDelightHours ?? 0,
      unbilledHours: data?.unbilledHours ?? 0,
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const response = await eodReportService.updateEodReport(values);

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

      dispatch(eodReportService.fetchEodReportList());
    },
  });

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Eod Report
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={4} style={{ marginBottom: 4 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-deptId">Department Name</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('departmentId')}
                  error={!!formik.errors.departmentId}
                  label="Department Name"
                  value={formik.getFieldMeta('departmentId').value}
                >
                  {deptData &&
                    deptData.length > 0 &&
                    deptData?.map((dept: any, key: number) => {
                      return (
                        <MenuItem value={dept.departmentId} key={key}>
                          {dept.departmentName.toUpperCase()}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              {formik.touched.departmentId && formik.errors.departmentId && (
                <div className="fv-plugins-message-container">
                  <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.departmentId}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Employee Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Employee Name"
                  {...formik.getFieldProps('employeeId')}
                  value={formik.values.employeeId}
                  error={!!formik.errors.employeeId}
                >
                  {empdata &&
                    empdata.length > 0 &&
                    empdata?.map((emp: any, key: number) => {
                      return (
                        <MenuItem value={emp.employeeId} key={key}>
                          {`${emp.firstName} ${emp.lastName}`}
                        </MenuItem>
                      );
                    })}
                </Select>
                {formik.touched.employeeId && formik.errors.employeeId && (
                  <div className="fv-plugins-message-container">
                    <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.employeeId}</div>
                  </div>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={4} style={{ marginBottom: 4 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="contractLbl">Contract Name</InputLabel>

                <Select
                  labelId="contractLbl"
                  id="contractName"
                  label="Contract Name"
                  {...formik.getFieldProps('projectId')}
                  error={!!formik.errors.projectId}
                  onChange={formik.handleChange}
                >
                  {projectData?.length > 0 ? (
                    projectData.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.projectId}>
                          {item.contractName.toUpperCase()}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="">--</MenuItem>
                  )}
                </Select>
                {formik.touched.projectId && formik.errors.projectId && (
                  <div className="fv-plugins-message-container">
                    <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.projectId}</div>
                  </div>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Billing Hours"
                {...formik.getFieldProps('billingHours')}
                error={!!formik.errors.billingHours}
                onChange={formik.handleChange}
                value={formik.values.billingHours}
              />
              {formik.touched.billingHours && formik.errors.billingHours && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.billingHours}</div>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={4} style={{ marginBottom: 4 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Employee Delighted Hours"
                {...formik.getFieldProps('employeeDelightHours')}
                error={!!formik.errors.employeeDelightHours}
                onChange={formik.handleChange}
                value={formik.values.employeeDelightHours}
              />
              {formik.touched.employeeDelightHours && formik.errors.employeeDelightHours && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.employeeDelightHours}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Unbilled Hours"
                {...formik.getFieldProps('unbilledHours')}
                error={!!formik.errors.unbilledHours}
                onChange={formik.handleChange}
                value={formik.values.unbilledHours}
              />
              {formik.touched.unbilledHours && formik.errors.unbilledHours && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.unbilledHours}</div>
                </div>
              )}
            </Grid>
          </Grid>
          <div className={classes.submitClose}>
            <Button className={classes.submitBtn} color="primary" variant="contained" type="submit">
              Submit
            </Button>
            <div className={classes.closeBtn}>
              <Button className={classes.submitBtn} onClick={handleCloseDialog} color="primary" variant="contained">
                Close
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
