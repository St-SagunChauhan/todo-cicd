import React, { useEffect, useState } from 'react';
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
import moment from 'moment';
import Swal from 'sweetalert2';
import * as yup from 'yup';
// import { Weeks } from 'Enums/ConnectEnum';
import { projectDeptSelector } from 'selectors/projectDept.selector';
import projectBillingService from 'services/projectBilling.Request';
import { deptSelector } from 'selectors/dept.selector';
import { projectSelector } from 'selectors/project.selector';
import { marketPlaceAccountSelector } from 'selectors/marketPlaceAccount';
import { projectBillingStyle } from './projectBilling.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
  selectedDept?: string;
};

const validationSchema = yup.object({
  projectId: yup.string().required('Contract name is required!'),
  // hourBilled: yup.number().required('Billed hours are required!'),
  marketPlaceAccountId: yup.string().required('Market Place is required!'),
  startDate: yup.string().required('Start date is required!'),
  endDate: yup.string().required('end date is required!'),
  billableHours: yup.string().required('Billable Hours is required'),
  // week: yup.string().required('Week is required!'),
});

export default function EditProjectBillingModal({ isOpen, handleCloseDialog, data, selectedDept }: IProps): JSX.Element {
  console.log(data);

  const classes = projectBillingStyle();
  const dispatch = useDispatch();
  const projectDeptData = useSelector(projectSelector);
  const marketPlaceData = useSelector(marketPlaceAccountSelector);
  const [deptList, setDeptList] = useState([]);
  const deptData = useSelector(deptSelector);

  const formik = useFormik({
    initialValues: {
      billingId: data.billingId,
      projectId: data?.projectId ?? '',
      hoursBilled: data?.hoursBilled ?? 0,
      minutesBilled: data?.minutesBilled ?? 0,
      marketPlaceAccountId: data?.marketPlaceAccountId ?? '',
      departmentId: data?.departmentId ?? '',
      startDate: moment(data?.startDate).format('YYYY-MM-DD') ?? '',
      endDate: moment(data?.endDate).format('YYYY-MM-DD') ?? '',
      billableHours: data?.billableHours ?? 0,
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const response = await projectBillingService.updateProjectBilling(values);

      handleCloseDialog();
      resetForm();
      dispatch(projectBillingService.fetchProjectBillingList(undefined, undefined, selectedDept || undefined));

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

      const deptFilter = selectedDept === 'all' ? null : selectedDept;
      dispatch(projectBillingService.fetchProjectBillingList(undefined, undefined, deptFilter));
    },
  });

  const allHours = [];
  for (let i = 0; i <= 100; i++) {
    allHours.push(i);
  }

  useEffect(() => {
    console.log(formik.values.minutesBilled);
    console.log('---------------');
    console.log(projectDeptData);
    console.log('================');

    const newArray =
      deptData &&
      deptData.length > 0 &&
      deptData?.map((dept: any, key: number) => ({
        label: dept.departmentName,
        value: dept.departmentId,
      }));
    setDeptList(newArray);
  }, [deptData]);

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Edit project billing
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={4} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                label="Weekly Billing Hours"
                {...formik.getFieldProps('billableHours')}
                error={!!formik.errors.billableHours}
                onChange={formik.handleChange}
                value={formik.values.billableHours}
              />
              {formik.touched.billableHours && formik.errors.billableHours && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.billableHours}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{ width: '40%' }} variant="outlined" size="small">
                <InputLabel id="hoursBilled">Hours</InputLabel>
                <Select
                  labelId="hoursBilled"
                  id="hoursBilled"
                  {...formik.getFieldProps('hoursBilled')}
                  label="Hours"
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {allHours.map((hr) => {
                    return (
                      <MenuItem key={hr} value={hr}>
                        {hr}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl style={{ width: '10%', marginLeft: '5%', marginRight: '5%' }} variant="outlined" size="small">
                <div style={{ fontSize: '20px', padding: '5px', marginLeft: '15px' }}>:</div>
              </FormControl>
              <FormControl style={{ width: '40%' }} variant="outlined" size="small">
                <InputLabel id="minutesBilled">Minutes</InputLabel>
                <Select labelId="minutesBilled" id="minutesBilled" {...formik.getFieldProps('minutesBilled')} label="Minutes">
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={40}>40</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              {formik.touched.hoursBilled && formik.errors.hoursBilled && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.hoursBilled}</div>
                </div>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={4} style={{ marginBottom: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="contractLbl">Contract Name</InputLabel>

                <Select
                  labelId="contractLbl"
                  id="contractName"
                  label="Contract Name"
                  {...formik.getFieldProps('projectId')}
                  error={!!formik.errors.projectId}
                  onChange={formik.handleChange}
                  MenuProps={{
                    style: {
                      maxHeight: 200,
                    },
                  }}
                >
                  {projectDeptData?.length > 0 ? (
                    projectDeptData.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.id}>
                          {item.contractName}
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
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="marketPlaceAccountIdLbl">Market Palce Name</InputLabel>

                <Select
                  labelId="marketPlaceAccountIdLbl"
                  id="MarrketPlcaeName"
                  label="Market Palce Name"
                  {...formik.getFieldProps('marketPlaceAccountId')}
                  error={!!formik.errors.marketPlaceAccountId}
                  onChange={formik.handleChange}
                  MenuProps={{
                    style: {
                      maxHeight: 200,
                    },
                  }}
                >
                  {marketPlaceData?.length > 0 ? (
                    marketPlaceData.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.id}>
                          {item.name.toUpperCase()}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="">--</MenuItem>
                  )}
                </Select>
                {formik.touched.marketPlaceAccountId && formik.errors.marketPlaceAccountId && (
                  <div className="fv-plugins-message-container">
                    <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.marketPlaceAccountId}</div>
                  </div>
                )}
              </FormControl>
            </Grid>
            {/* <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-deptId">Week</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('week')}
                  error={!!formik.errors.week}
                  label="Week"
                  value={formik.values.week}
                >
                  {Object.entries(Weeks).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {formik.touched.week && formik.errors.week && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.week}</div>
                </div>
              )}
            </Grid> */}
          </Grid>
          <Grid container spacing={4} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              {/* <InputLabel id="Connect_DateId">Connect Date</InputLabel> */}
              <TextField
                variant="outlined"
                size="small"
                id="startDate"
                fullWidth
                label="Start Date"
                type="date"
                {...formik.getFieldProps('startDate')}
                onChange={formik.handleChange}
                value={formik.values.startDate}
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.startDate}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              {/* <InputLabel id="Connect_DateId">Connect Date</InputLabel> */}
              <TextField
                variant="outlined"
                size="small"
                id="endDate"
                fullWidth
                label="End Date"
                type="date"
                {...formik.getFieldProps('endDate')}
                onChange={formik.handleChange}
                value={formik.values.endDate}
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.endDate}</div>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth size="small">
                <InputLabel id="demo-simple-select-deptId">Department Name</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('departmentId')}
                  error={!!formik.errors.departmentId}
                  label="Department Name"
                  value={formik.values.departmentId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {/* <CustomAutocomplete
                  data={deptList}
                  name="departmentId"
                  label="Department Name"
                  onChange={handleDepartmentChange}
                  value={formik.values.departmentId}
                /> */}
                  {deptList &&
                    deptList.length > 0 &&
                    deptList?.map((dept: any, key: number) => {
                      return (
                        <MenuItem value={dept.value} key={key}>
                          {dept.label}
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
