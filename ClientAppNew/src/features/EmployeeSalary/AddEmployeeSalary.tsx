import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import empService from 'services/emp.Request';
import empSalaryService from 'services/empSalary.Request';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  Typography,
  Divider,
} from '@material-ui/core';
import { empSelector } from 'selectors/emp.selector';
import Swal from 'sweetalert2';
import { useEmpStyles } from './emp.styles';

type props = {
  handleClose: () => void;
  isOpenEmployee: boolean;
};

const empValidation = yup.object({
  employeeId: yup.string().required('Employee Name is required'),
  basicSalary: yup.number().required('Basic Salary is required'),
  bankName: yup.string().required('Bank Name is required'),
  accountNumber: yup.string().required('Account Number is required'),
  ifscCode: yup.string().required('Ifsc Code is required'),
  bonus: yup.number().required('Bonus is required'),
  da: yup.number().required('Da is required'),
  hra: yup.number().required('Hra is required'),
  learningAllowance: yup.number().required('Learning Allowance is required'),
  uniformAllowance: yup.number().required('uniformAllowance is required'),
  conveyanceAllowance: yup.number().required('Conveyance Allowance is required'),
  projectLevelBonus: yup.number().required('ProjectLevelBonus is required'),
  grossSalary: yup.string().required('Gross Salary is required'),
  epfApplicable: yup.string().required('Epf Applicable is required'),
  esiApplicable: yup.string().required('Esi Applicable is required'),
  uanNo: yup.string(),
  esiNo: yup.string(),
});

export default function AddEmployeeSalary({ handleClose, isOpenEmployee }: props) {
  const classes = useEmpStyles();
  const dispatch = useDispatch();
  const empData = useSelector(empSelector);
  const [loading, setLoading] = useState(false);
  const [uanErrorMsg, uanSetError] = useState(true);
  const [esiErrorMsg, esiSetError] = useState(true);

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      basicSalary: 0,
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      bonus: 0,
      da: 0,
      hra: 0,
      learningAllowance: 0,
      uniformAllowance: 0,
      conveyanceAllowance: 0,
      projectLevelBonus: 0,
      grossSalary: '',
      epfApplicable: '',
      esiApplicable: '',
      uanNo: '',
      esiNo: '',
      isActive: true,
    },

    validationSchema: empValidation,
    onSubmit: async (values, { resetForm }) => {
      uanSetError(true);
      esiSetError(true);
      if (values.epfApplicable === 'Yes' && !values.uanNo) {
        uanSetError(false);
      } else if (values.esiApplicable === 'Yes' && !values.esiNo) {
        esiSetError(false);
      } else {
        setLoading(true);
        const response = await empSalaryService.createEmployeeSalary(values);
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

        dispatch(empSalaryService.fetchEmpSalaryList());
      }
    },
  });

  useEffect(() => {
    dispatch(empService.fetchEmpList());
  }, [dispatch]);

  return (
    <Dialog fullWidth maxWidth="md" open={isOpenEmployee} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Employee Salary
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromClientDetails">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-deptId">Employee Name</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('employeeId')}
                  label="Employee Name"
                  value={formik.values.employeeId}
                >
                  {empData &&
                    empData.length > 0 &&
                    empData?.map((emp: any, key: number) => {
                      return (
                        <MenuItem value={emp.employeeId} key={key}>
                          {`${emp.firstName} ${emp.lastName}`}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              {formik.touched.employeeId && formik.errors.employeeId && (
                <div className="fv-plugins-message-container">
                  <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.employeeId}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Bank Name" {...formik.getFieldProps('bankName')} error={!!formik.errors.bankName} />
              {formik.touched.bankName && formik.errors.bankName && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.bankName}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                {...formik.getFieldProps('accountNumber')}
                error={!!formik.errors.accountNumber}
              />
              {formik.touched.accountNumber && formik.errors.accountNumber && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.accountNumber}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Ifsc Code" {...formik.getFieldProps('ifscCode')} error={!!formik.errors.ifscCode} />
              {formik.touched.ifscCode && formik.errors.ifscCode && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.ifscCode}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Basic Salary"
                {...formik.getFieldProps('basicSalary')}
                error={!!formik.errors.basicSalary}
              />
              {formik.touched.basicSalary && formik.errors.basicSalary && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.basicSalary}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Bonus" {...formik.getFieldProps('bonus')} error={!!formik.errors.bonus} />
              {formik.touched.bonus && formik.errors.bonus && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.bonus}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Da" {...formik.getFieldProps('da')} error={!!formik.errors.da} />
              {formik.touched.da && formik.errors.da && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.da}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Hra" {...formik.getFieldProps('hra')} error={!!formik.errors.hra} />
              {formik.touched.hra && formik.errors.hra && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.hra}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Learning Allowance"
                {...formik.getFieldProps('learningAllowance')}
                error={!!formik.errors.learningAllowance}
              />
              {formik.touched.learningAllowance && formik.errors.learningAllowance && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.learningAllowance}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Uniform Allowance"
                {...formik.getFieldProps('uniformAllowance')}
                error={!!formik.errors.uniformAllowance}
              />
              {formik.touched.uniformAllowance && formik.errors.uniformAllowance && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.uniformAllowance}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Conveyance Allowance"
                {...formik.getFieldProps('conveyanceAllowance')}
                error={!!formik.errors.conveyanceAllowance}
              />
              {formik.touched.conveyanceAllowance && formik.errors.conveyanceAllowance && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.conveyanceAllowance}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Level Bonus"
                {...formik.getFieldProps('projectLevelBonus')}
                error={!!formik.errors.projectLevelBonus}
              />
              {formik.touched.projectLevelBonus && formik.errors.projectLevelBonus && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.projectLevelBonus}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gross Salary"
                {...formik.getFieldProps('grossSalary')}
                error={!!formik.errors.grossSalary}
              />
              {formik.touched.grossSalary && formik.errors.grossSalary && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.grossSalary}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">Epf Applicable</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Epf Applicable"
                  {...formik.getFieldProps('epfApplicable')}
                  error={!!formik.errors.epfApplicable}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
              {formik.touched.epfApplicable && formik.errors.epfApplicable && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.epfApplicable}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">Esi Applicable</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Esi Applicable"
                  {...formik.getFieldProps('esiApplicable')}
                  error={!!formik.errors.esiApplicable}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
              {formik.touched.esiApplicable && formik.errors.esiApplicable && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.esiApplicable}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Uan No" {...formik.getFieldProps('uanNo')} error={!!formik.errors.uanNo} />
              {formik.touched.uanNo && formik.errors.uanNo && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.uanNo}</div>
                </div>
              )}
              {uanErrorMsg ? '' : <p style={{ color: 'red', marginTop: 2, marginBottom: 0 }}>Uan No is required!</p>}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Esi No" {...formik.getFieldProps('esiNo')} error={!!formik.errors.esiNo} />
              {formik.touched.esiNo && formik.errors.esiNo && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.esiNo}</div>
                </div>
              )}
              {esiErrorMsg ? '' : <p style={{ color: 'red', marginTop: 2, marginBottom: 0 }}>Esi No is required!</p>}
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
