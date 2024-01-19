import React, { useState, useEffect } from 'react';
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
  FormHelperText,
} from '@material-ui/core';
import { FieldArray, FormikErrors, FormikProvider, useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { deptSelector } from 'selectors/dept.selector';
import { empSelector } from 'selectors/emp.selector';
import eodReportService from 'services/eodReportRequest';
import { projectSelector } from 'selectors/project.selector';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import authService from 'services/authService';
import { eodReportStyle } from './eodReport.style';

type IProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const userInfo: any = JSON.parse(authService.getUser());
const validationSchema = yup.object({
  departmentId: yup.string().required('Department Name is required!'),
  eodDate: yup.date().required('EOD Date is required'),
  projectHours: yup.array(
    yup.object().shape({
      projectId: yup
        .string()
        .required('Project ID is required')
        .matches(/^[\w-]+$/, 'Project ID must contain only letters, numbers, hyphens, or underscores'),
      billingHours: yup
        .number()
        .required('Billing Hours is required')
        .min(0, 'Billing Hours must be greater than or equal to 0')
        .max(24, 'Billing Hours cannot exceed 24'), // Adjust the maximum value as needed
    }),
  ),
  employeeHours: yup
    .array(
      yup.object().shape({
        projectId: yup
          .string()
          .matches(/^[\w-]+$/, 'Employee ID must contain only letters, numbers, hyphens, or underscores')
          .test(
            'unique',
            'Please choose a different project. The selected project is already selected in contract name.',
            function (value, context: any) {
              // Perform the uniqueness check only if projectId is provided
              if (value) {
                const projectHourIds = context.from[1]?.value.projectHours?.map((ph: any) => ph.projectId);
                return !projectHourIds.includes(value);
              }
              return true; // If projectId is not provided, consider it unique
            },
          ),
        employeeDelightHours: yup
          .number()
          .required('Employee Delight Hours is required')
          .min(0, 'Employee Delight Hours must be greater than or equal to 0')
          .max(24, 'Employee Delight Hours cannot exceed 24'), // Adjust the maximum value as needed
      }),
    )
    .required(),
});

export default function AddEodReportModal({ isOpen, handleClose }: IProps): JSX.Element {
  const classes = eodReportStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const deptData = useSelector(deptSelector);
  const projectData = useSelector(projectSelector);

  const date = new Date();
  const todayDate = new Date(date);

  const mondayexist = new Date(todayDate).toLocaleString('en-us', { weekday: 'long' });
  if (mondayexist === 'Monday') {
    todayDate.setDate(todayDate.getDate());
  } else {
    todayDate.setDate(todayDate.getDate() - 1);
  }

  const year = todayDate.toLocaleString('default', { year: 'numeric' });
  const month = todayDate.toLocaleString('default', { month: '2-digit' });
  const day = todayDate.toLocaleString('default', { day: '2-digit' });

  const yesterdayDate = [year, month, day].join('-');

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      departmentId: '',
      employeeDelightHours: 0,
      unbilledHours: 0,
      isActive: true,
      projectHours: [{ projectId: '', billingHours: 0 }],
      employeeHours: [{ projectId: '', employeeDelightHours: 0 }],
      eodDate: yesterdayDate,
      remarks: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (userInfo?.employeeId) {
        values.employeeId = userInfo?.employeeId;
      }
      setLoading(true);
      const response = await eodReportService.addEodReport(values);
      setLoading(false);
      handleClose();
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

  const [projectNameError, setProjectNameError] = useState('');

  useEffect(() => {
    if (formik.values.projectHours) {
      let hasError = false;
      formik.values.projectHours.forEach((projectHour, index) => {
        const contractId = projectHour.projectId;
        const isDuplicate = formik.values.projectHours.some((ph, i) => i !== index && ph.projectId === contractId);

        if (isDuplicate) {
          hasError = true;
          setProjectNameError('Project name must be unique for each contract');
        }
      });

      if (!hasError) {
        setProjectNameError('');
      }
    }
  }, [formik.values.projectHours]);

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Eod Report
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <FormikProvider value={formik}>
          <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
            <FieldArray
              name="projectHours"
              render={(arrayHelpers) => (
                <div>
                  {formik.values.projectHours && formik.values.projectHours.length > 0 ? (
                    formik.values.projectHours.map((projectHour, index) => (
                      <div key={index}>
                        <Grid container spacing={3} style={{ marginBottom: 4 }}>
                          <Grid item xs={5}>
                            <FormControl fullWidth>
                              <InputLabel id={`contractLbl-${index}`}>Contract Name</InputLabel>
                              <Select
                                name={`projectHours[${index}].projectId`}
                                labelId={`contractLbl-${index}`}
                                id={`contractName-${index}`}
                                label="Contract Name"
                                onChange={formik.handleChange}
                                value={formik.getFieldMeta(`project[${index}].projectId`).value}
                              >
                                {projectData?.length > 0 ? (
                                  projectData.map((item: any, i: number) => {
                                    return (
                                      <MenuItem key={i} value={item.id}>
                                        {item.contractName.toUpperCase()}
                                      </MenuItem>
                                    );
                                  })
                                ) : (
                                  <MenuItem value="">--</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={5}>
                            <TextField
                              name={`projectHours[${index}].billingHours`}
                              fullWidth
                              type="number"
                              label="Billing Hours"
                              onChange={formik.handleChange}
                              value={projectHour.billingHours}
                            />
                          </Grid>
                          {projectNameError && <div style={{ color: 'red' }}>{projectNameError}</div>}
                          <div
                            style={{
                              verticalAlign: 'center',
                              display: 'inline-flex',
                              margin: '35px 2px 10px 10px',
                            }}
                          >
                            <Button
                              type="button"
                              color="primary"
                              variant="contained"
                              startIcon={<RemoveIcon />}
                              onClick={() => arrayHelpers.remove(index)}
                              style={{ marginRight: '4px' }}
                            >
                              {' '}
                            </Button>
                            <Button
                              type="button"
                              color="primary"
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => arrayHelpers.push({ index })}
                            >
                              {' '}
                            </Button>
                          </div>
                        </Grid>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        verticalAlign: 'center',
                        display: 'inline-flex',
                        margin: '10px 2px 35px 10px',
                      }}
                    >
                      <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => arrayHelpers.push('index')}
                      >
                        Click here to add the Project and Billing Hours
                      </Button>
                    </div>
                  )}
                </div>
              )}
            />
            {/* <Grid container spacing={4} style={{ marginBottom: 4 }}>
              <Grid item xs={5}>
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
                <TextField
                  size="small"
                  fullWidth
                  {...formik.getFieldProps('employeeId')}
                  label="Employee Name"
                  value={`${userInfo?.firstName} ${userInfo?.lastName}`}
                  disabled
                  InputProps={{
                    style: { color: 'darkslategray' },
                  }}
                />
              </Grid>
            </Grid> */}
            <FieldArray
              name="employeeHours"
              render={(arrayEmployeeHelpers) => (
                <div>
                  {formik.values.employeeHours && formik.values.employeeHours.length > 0 ? (
                    formik.values.employeeHours.map((employeeHour, index) => {
                      const errors = formik.errors.employeeHours as FormikErrors<{
                        projectId: string;
                        employeeDelightHours: number;
                      }>[];
                      return (
                        <div key={index}>
                          <Grid container spacing={4} style={{ marginBottom: 4 }}>
                            <Grid item xs={5}>
                              <FormControl fullWidth>
                                <InputLabel id={`projectLbl-${index}`}>Project Name</InputLabel>
                                <Select
                                  name={`employeeHours[${index}].projectId`}
                                  labelId={`projectLbl-${index}`}
                                  id={`projectName-${index}`}
                                  label="Project Name"
                                  onChange={formik.handleChange}
                                  value={formik.getFieldMeta(`project[${index}].projectId`).value}
                                >
                                  {projectData?.length > 0 ? (
                                    projectData.map((item: any, i: number) => {
                                      return (
                                        <MenuItem key={i} value={item.id}>
                                          {item.contractName.toUpperCase()}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <MenuItem value="">--</MenuItem>
                                  )}
                                </Select>
                              </FormControl>
                              {errors && errors.length > 0 && <FormHelperText error>{errors[index]?.projectId}</FormHelperText>}
                            </Grid>
                            <Grid item xs={5}>
                              <TextField
                                name={`employeeHours[${index}].employeeDelightHours`}
                                fullWidth
                                type="number"
                                label="Employee Delight Hours"
                                onChange={formik.handleChange}
                                value={employeeHour.employeeDelightHours}
                              />
                            </Grid>
                            <div
                              style={{
                                verticalAlign: 'center',
                                display: 'inline-flex',
                                margin: '42px 2px 10px 10px',
                              }}
                            >
                              <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                startIcon={<RemoveIcon />}
                                onClick={() => arrayEmployeeHelpers.remove(index)}
                                style={{ marginRight: '4px' }}
                              >
                                {' '}
                              </Button>
                              <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => arrayEmployeeHelpers.push({ index })}
                              >
                                {' '}
                              </Button>
                            </div>
                          </Grid>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        verticalAlign: 'center',
                        display: 'inline-flex',
                        margin: '10px 2px 35px 10px',
                      }}
                    >
                      <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => arrayEmployeeHelpers.push('index')}
                      >
                        Click here to add the Project and Employee Delight Hours
                      </Button>
                    </div>
                  )}
                </div>
              )}
            />
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                className={classes.customInputHeight}
                variant="outlined"
                size="small"
                type="textarea"
                label="Remarks"
                {...formik.getFieldProps('remarks')}
                error={Boolean(formik.errors.remarks && formik.touched.remarks)}
                helperText={formik.errors.remarks}
              />
            </Grid>
            {/* <Grid container spacing={4} style={{ marginBottom: 4 }}>
              <Grid item xs={5}>
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
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  id="date"
                  type="date"
                  label="EOD Date"
                  defaultValue=""
                  {...formik.getFieldProps('eodDate')}
                  error={!!formik.errors.eodDate}
                />
                {formik.touched.eodDate && formik.errors.eodDate && (
                  <div className="fv-plugins-message-container">
                    <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.eodDate}</div>
                  </div>
                )}
              </Grid>
            </Grid> */}

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
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </form>
        </FormikProvider>
      </div>
    </Dialog>
  );
}
