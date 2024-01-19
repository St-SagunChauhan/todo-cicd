import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
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
  MenuList,
} from '@material-ui/core';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { projectDeptSelector } from 'selectors/projectDept.selector';
import { deptSelector } from 'selectors/dept.selector';
import projectBillingService from 'services/projectBilling.Request';
import { marketPlaceAccountSelector } from 'selectors/marketPlaceAccount';
import projectService from 'services/project.Requets';
import { projectSelector } from 'selectors/project.selector';
import empService from 'services/emp.Request';
import clientService from 'services/clientRequest';
import masterReportService from 'services/masterReport';
import CustomDateRange from 'components/molecules/CustomDateRange/CustomDateRange';
import CustomAutocomplete from 'components/molecules/CustomAutoComplete/CustomAutoComplete';
import { projectBillingStyle } from './projectBilling.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

const validationSchema = yup.object({
  projectId: yup.string().required('Contract name is required!'),
  // hoursBilled: yup.number().required('Billed hours are required!'),
  // minBilled: yup.number().required('Billed Minutes are required!'),
  marketPlaceAccountId: yup.string().required('Market Place is required!'),
  startDate: yup.date().required('Start date is required!'),
  endDate: yup.date().required('End date is required!').min(yup.ref('startDate'), 'Start Date Should be Older then End Date'),
  departmentId: yup.string().required('Please Select only one department for billing'),
  // week: yup.string().required('Week is required!'),
});

export default function AddProjectBillingModal({ isOpen, handleCloseDialog }: IProps): JSX.Element {
  const classes = projectBillingStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [deptList, setDeptList] = useState([]);
  const [proName, setProname] = useState();
  const [startDates, setStartDate] = useState('');
  const [currentDates, setcurrentDate] = useState('');
  const projectDeptData = useSelector(projectDeptSelector);
  const marketPlaceData = useSelector(marketPlaceAccountSelector);
  const projectSelect = useSelector(projectSelector);
  const deptData = useSelector(deptSelector);

  const formik = useFormik({
    initialValues: {
      projectId: '',
      hoursBilled: 0,
      minutesBilled: 0,
      marketPlaceAccountId: '',
      startDate: '',
      endDate: '',
      departmentId: '',
      billableHours: 0,
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);

      setLoading(true);
      const response = await projectBillingService.addNewProjectBilling(values);
      console.log(response);

      setLoading(false);
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
      dispatch(projectBillingService.fetchProjectBillingList());
    },
  });

  const onChangeDate = (data: Record<string, string>) => {
    setcurrentDate(data?.endDate);
    setStartDate(data?.startDate);
    dispatch(masterReportService.fetchmasterbillingReport(data?.startDate, data?.endDate));
  };

  const getContractDetail = async (e: any, value: any) => {
    console.log(e);
    const proId = value.props.value;
    const getProData = await projectService.getProject(proId);
    const proinfo = getProData.project;
    const { departmentName, departmentId } = proinfo;
    const deptArr = departmentName.map((dept: any, key: number) => ({
      label: dept,
      value: departmentId[key],
    }));
    setDeptList(deptArr);

    // console.log(projectDeptData);

    setProname(e.value);
    formik.setFieldValue('projectId', e.target.value);
  };

  const handleDepartmentChange = (e: any, value: any) => {
    const deptFilter = value.map((i: any) => i.value);
    dispatch(empService.fetchEmpListByDept(deptFilter));
    dispatch(clientService.fetchClientListByDept(deptFilter));
    formik.setFieldValue('departmentId', value);
  };

  useEffect(() => {
    const newArray =
      deptData &&
      deptData.length > 0 &&
      deptData?.map((dept: any, key: number) => ({
        label: dept.departmentName,
        value: dept.departmentId,
      }));
    setDeptList(newArray);
  }, [deptData]);

  const allHours = [];
  for (let i = 0; i <= 100; i++) {
    allHours.push(i);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new project billing
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={4} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <InputLabel id="weeklyBillingHours" style={{ marginBottom: '5px' }}>
                Weekly Billing Hours
              </InputLabel>
              {/* <TextField
                fullWidth
                type="number"
                {...formik.getFieldProps('billableHours')}
                error={!!formik.errors.billableHours}
                onChange={formik.handleChange}
                value={formik.values.billableHours}
              /> */}
              <TextField
                type="number"
                id="billableHours"
                fullWidth
                size="small"
                variant="outlined"
                {...formik.getFieldProps('billableHours')}
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
              <InputLabel id="billedHours" style={{ marginBottom: '5px' }}>
                Billed Hours
              </InputLabel>
              {/* <InputMask mask="99:99" {...formik.getFieldProps('hourBilled')} maskChar=" ">
                {(props: any) => <TextField variant="outlined" size="small" {...props} />}
              </InputMask> */}
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
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="marketPlaceAccountIdLbl">Market Place Name</InputLabel>

                <Select
                  labelId="marketPlaceAccountIdLbl"
                  id="MarrketPlcaeName"
                  label="Market Place Name"
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
                          {item.name}
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel htmlFor="contractLb1">Contract Name</InputLabel>
                <Select
                  labelId="contractLbl"
                  label="Contract Name"
                  {...formik.getFieldProps('projectId')}
                  error={!!formik.errors.projectId}
                  onChange={getContractDetail}
                  value={formik.values.projectId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {projectDeptData?.length > 0 ? (
                    projectDeptData.map((item: any, index: number) => {
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
            {/* <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-deptId">Week</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('week')}
                  error={!!formik.errors.week}
                  label="week"
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
          {/* <div style={{ width: '100%' }}> */}
          {/* <CustomDateRange onChange={onChangeDate} defaultValues={{ startDate: startDates, endDate: currentDates }} /> */}
          {/* </div> */}
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputLabel id="startDateId">Start Date</InputLabel>
              <TextField
                id="startDate"
                fullWidth
                type="date"
                variant="outlined"
                size="small"
                {...formik.getFieldProps('startDate')}
                error={!!formik.errors.startDate}
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
              <InputLabel id="endDateId">End Date</InputLabel>
              <TextField
                id="endDate"
                fullWidth
                type="date"
                variant="outlined"
                size="small"
                {...formik.getFieldProps('endDate')}
                error={!!formik.errors.endDate}
                onChange={formik.handleChange}
                value={formik.values.endDate}
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <div className="fv-plugins-message-container">
                  <div className={`"fv-help-block" ${classes.labelError}`}>{formik.errors.endDate}</div>
                </div>
              )}
            </Grid>

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
            <Button className={classes.submitBtn} disabled={loading} color="primary" variant="contained" type="submit">
              {loading ? 'Please Wait...' : 'Submit'}
            </Button>
            <div className={classes.closeBtn}>
              <Button
                className={classes.submitBtn}
                disabled={loading}
                color="primary"
                variant="contained"
                onClick={handleCloseDialog}
              >
                Close
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
