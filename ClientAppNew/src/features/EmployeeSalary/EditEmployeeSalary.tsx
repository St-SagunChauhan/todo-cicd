import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import empService from 'services/emp.Request';
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
import empSalaryService from 'services/empSalary.Request';
import { IEmployee } from './EmpModel';
import { useEmpStyles } from './emp.styles';

type props = {
  employee: IEmployee | undefined;
  handleCloseEdit: () => void;
  isOpenEdit: boolean;
};

const empValidation = yup.object({
  employeeId: yup.string().required('Employee Name is required'),
  basicSalary: yup.number().required('Basic Salary is required'),
  bankName: yup.string().required('Bank Name is required'),
  accountNumber: yup.string().required('Account Number is required'),
  ifscCode: yup.string().required('Ifsc Code is required'),
  bonus: yup.number().required('Bonus is required'),
  da: yup.number().required('Da is required'),
  hra: yup.number().required('hra is required'),
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

export default function UpdateEmployeeSalary({ handleCloseEdit, isOpenEdit, employee }: props) {
  const classes = useEmpStyles();
  const dispatch = useDispatch();
  const empData = useSelector(empSelector);
  const [loading, setLoading] = useState(false);
  const [uanErrorMsg, uanSetError] = useState(true);
  const [esiErrorMsg, esiSetError] = useState(true);

  useEffect(() => {
    dispatch(empService.fetchEmpList());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      salaryId: employee?.salaryId ?? '',
      employeeId: employee?.employeeId ?? '',
      basicSalary: employee?.basicSalary ?? 0,
      bankName: employee?.bankName ?? '',
      accountNumber: employee?.accountNumber ?? '',
      ifscCode: employee?.ifscCode ?? '',
      bonus: employee?.bonus ?? 0,
      da: employee?.da ?? 0,
      hra: employee?.hra ?? 0,
      learningAllowance: employee?.learningAllowance ?? 0,
      uniformAllowance: employee?.uniformAllowance ?? 0,
      conveyanceAllowance: employee?.conveyanceAllowance ?? 0,
      projectLevelBonus: employee?.projectLevelBonus ?? 0,
      grossSalary: employee?.grossSalary ?? '',
      epfApplicable: employee?.epfApplicable ?? '',
      esiApplicable: employee?.esiApplicable ?? '',
      uanNo: employee?.uanNo ?? '',
      esiNo: employee?.esiNo ?? '',
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
        const response = await empSalaryService.updateEmployeeSalary(values);
        setLoading(false);
        handleCloseEdit();
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

  return (
    <Dialog fullWidth maxWidth="md" open={isOpenEdit} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Edit Employee Salary
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromSalaryDetails">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <TextField fullWidth label="Bank Name" {...formik.getFieldProps('bankName')} />
              {formik.touched.bankName && formik.errors.bankName && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.bankName}</div>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Account Number" {...formik.getFieldProps('accountNumber')} />
              {formik.touched.accountNumber && formik.errors.accountNumber && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.accountNumber}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Ifsc Code" {...formik.getFieldProps('ifscCode')} />
              {formik.touched.ifscCode && formik.errors.ifscCode && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.ifscCode}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Basic Salary" {...formik.getFieldProps('basicSalary')} />
              {formik.touched.basicSalary && formik.errors.basicSalary && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.basicSalary}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Bonus" {...formik.getFieldProps('bonus')} />
              {formik.touched.bonus && formik.errors.bonus && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.bonus}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Da" {...formik.getFieldProps('da')} />
              {formik.touched.da && formik.errors.da && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.da}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Hra" type="hra" {...formik.getFieldProps('hra')} />
              {formik.touched.hra && formik.errors.hra && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.hra}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Learning Allowance"
                type="learningAllowance"
                {...formik.getFieldProps('learningAllowance')}
              />
              {formik.touched.learningAllowance && formik.errors.learningAllowance && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.learningAllowance}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Uniform Allowance"
                type="uniformAllowance"
                {...formik.getFieldProps('uniformAllowance')}
              />
              {formik.touched.uniformAllowance && formik.errors.uniformAllowance && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.uniformAllowance}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Conveyance Allowance"
                type="conveyanceAllowance"
                {...formik.getFieldProps('conveyanceAllowance')}
              />
              {formik.touched.conveyanceAllowance && formik.errors.conveyanceAllowance && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.conveyanceAllowance}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Project Level Bonus"
                type="projectLevelBonus"
                {...formik.getFieldProps('projectLevelBonus')}
              />
              {formik.touched.projectLevelBonus && formik.errors.projectLevelBonus && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.projectLevelBonus}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Gross Salary" type="grossSalary" {...formik.getFieldProps('grossSalary')} />
              {formik.touched.grossSalary && formik.errors.grossSalary && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.grossSalary}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">Epf Applicable</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Epf Applicable"
                  {...formik.getFieldProps('epfApplicable')}
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
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">Esi Applicable</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Esi Applicable"
                  {...formik.getFieldProps('esiApplicable')}
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
            <Grid item xs={6}>
              <TextField fullWidth label="Uan No" type="uanNo" {...formik.getFieldProps('uanNo')} />
              {formik.touched.uanNo && formik.errors.uanNo && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.uanNo}</div>
                </div>
              )}
              {uanErrorMsg ? '' : <p style={{ color: 'red', marginTop: 2, marginBottom: 0 }}>Uan No is required!</p>}
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Esi No" type="esiNo" {...formik.getFieldProps('esiNo')} />
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
                  onClick={() => handleCloseEdit()}
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
