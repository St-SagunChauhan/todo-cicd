import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  Button,
  Grid,
  TextField,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  FormHelperText,
} from '@material-ui/core';
import moment from 'moment';
import { useFormik } from 'formik';
import empService from 'services/emp.Request';
import clientService from 'services/clientRequest';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { deptSelector } from 'selectors/dept.selector';
import { clientSelector } from 'selectors/client.selector';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import { marketPlaceAccountSelector } from 'selectors/marketPlaceAccount';
import { empSelector } from 'selectors/emp.selector';
import CustomAutocomplete from 'components/molecules/CustomAutoComplete/CustomAutoComplete';
import {
  BillingTypeEnum,
  ContractTypeEnum,
  AccountTypeEnum,
  ProjectStatusEnum,
  ContractStatus,
} from 'Enums/ProjectEnum/ProjectEnum';
import { StatusEnum } from 'Enums/LeaveEnum/LeaveEnum';
import { countries } from 'helpers/countries';
import projectService from '../../services/project.Requets';
import projectClientStyles from './project.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
  selectedDept?: string;
};

const validationSchema = yup.object({
  contractName: yup.string().required('Contract Name is required!'),
  departmentId: yup.array().min(1, 'Please Select atleast one Department').required('Department Name is required'),
  employeeId: yup.array().min(1, 'Please Select atleast one Employee').required('Employee Name is required'),
  clientId: yup.string().required('Please Select the Client'),
  accounts: yup.string().required('Account Type is required!'),
  contractType: yup.string().required('Contract type is required!'),
  billingType: yup.string().required('Billing Type is required!'),
  projectUrl: yup.string().required('Project Url is required!'),
  startDate: yup.date().required('Start Date is required!'),
  endDate: yup.date().min(yup.ref('startDate'), 'Start Date Should be Older then End Date').nullable(),
  hoursPerWeek: yup.string().required('Per week hours are required!'),
});

export default function EditProjectModel({ isOpen, handleCloseDialog, data, selectedDept }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [deptName, setDeptName] = useState<any[]>([]);
  const [empDrop, setEmpDrop] = useState<any[]>([]);
  const [contractList, setContractList] = useState<any>([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [billingstatusList, setbillingstatus] = useState<any>([]);

  const classes = projectClientStyles();
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const clientData = useSelector(clientSelector);
  const employeeData = useSelector(empSelector);
  const marketplaceAccount = useSelector(marketPlaceAccountSelector);

  // console.log('data: ', data);

  const deptIds =
    data.departmentId.length > 0 &&
    data.departmentId.map((item: any, index: any) => {
      return { label: data.departmentName[index], value: item };
    });

  // console.log('deptIDS: ', deptIds);

  const formik = useFormik({
    initialValues: {
      contractName: data?.contractName ?? '',
      accounts: data?.accounts ?? '',
      contractType: data?.contractType ?? '',
      billingType: data?.billingType ?? '',
      hoursPerWeek: data?.hoursPerWeek ?? '',
      startDate: data?.startDate ? moment(data?.startDate).format('YYYY-MM-DD') : null,
      endDate: data?.endDate ? moment(data?.endDate).format('YYYY-MM-DD') : null,
      projectUrl: data?.projectUrl ?? '',
      projectReview: data?.projectReview ?? '',
      projectId: data?.id ?? '',
      departmentId: deptIds,
      clientId: data?.clientId ?? '',
      status: data?.status ?? '',
      rating: data?.rating ?? null,
      employeeId: data?.employeeProjects.map((x: { employeeId: any }) => x.employeeId),
      communicationMode: data?.communicationMode,
      country: data?.country,
      isActive: true,
      marketPlaceAccountId: data?.upworkId ?? '',
      billingStatus: data?.billingStatus,
    },

    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const response = await projectService.updateProject(values);
      handleCloseDialog();
      resetForm();
      dispatch(projectService.fetchProjectList(selectedDept || null));

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
      dispatch(projectService.fetchProjectList(deptFilter));
    },
  });

  console.log('formik values: ', formik.values);

  const handleDepartmentChange = (e: any, value: any) => {
    console.log('Dept IDs: ', value);

    const deptFilter = value.map((i: any) => i.value);
    dispatch(empService.fetchEmpListByDept(deptFilter));
    dispatch(clientService.fetchClientListByDept(deptFilter));
    formik.setFieldValue('departmentId', value);
  };

  const handleEmpChange = (e: any, value: any) => {
    const deptFilter = value.map((i: any) => i.value);
    dispatch(empService.fetchEmpListByDept(deptFilter));
    dispatch(clientService.fetchClientListByDept(deptFilter));
    formik.setFieldValue('employeeId', value);
  };

  useEffect(() => {
    if (clientData === null) {
      dispatch(clientService.fetchClientListByDept(data.departmentId));
    }
  }, [clientData]);

  useEffect(() => {
    const newArray =
      deptData &&
      deptData.length > 0 &&
      deptData?.map((dept: any, key: number) => ({
        label: dept.departmentName,
        value: dept.departmentId,
      }));
    newArray?.length > 0 && setDeptName(newArray);
    if (employeeData === null) {
      dispatch(empService.fetchEmpListByDept(data.departmentId));
    }
    console.log(employeeData);

    const empArray =
      employeeData &&
      employeeData.length > 0 &&
      employeeData?.map((emp: any, key: number) => ({
        label: emp.firstName.concat(' ', emp.lastName),
        value: emp.employeeId,
      }));
    newArray?.length > 0 && setEmpDrop(empArray);
  }, [employeeData]);

  useEffect(() => {
    const newEmpArr = data.employeeId.map((id: any, index: number) => ({
      value: id,
      label: data.employees[index],
    }));
    const newArrayDept = data.departmentId.map((id: any, index: any) => ({
      value: id,
      label: data.departmentName[index],
    }));
    formik.setFieldValue('employeeId', newEmpArr || []);
    formik.setFieldValue('departmentId', newArrayDept || []);
  }, []);

  useEffect(() => {
    const myArray: { label: string; value: string }[] = [];
    const statusArray: { label: string; value: string }[] = [];
    const billingArray: { label: string; value: string }[] = [];
    const contractData = Object.entries(ContractTypeEnum).map(([key, val]) => ({
      label: val,
      value: key,
    }));
    const statusData = Object.entries(ProjectStatusEnum).map(([key, val]) => ({
      label: val,
      value: key,
    }));
    const billingData = Object.entries(ContractStatus).map(([key, val]) => ({
      label: val,
      value: key,
    }));
    const completedLabel = { label: 'Completed', value: 'Completed' };
    myArray.push(...contractData);
    statusArray.push(...statusData);
    billingArray.push(...billingData, completedLabel);
    setContractList(myArray);
    setStatusList(statusArray);
    setbillingstatus(billingArray);
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Edit project  
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewDepartment">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Contract Name"
                {...formik.getFieldProps('contractName')}
                error={Boolean(formik.errors.contractName && formik.touched.contractName)}
                helperText={formik.errors.contractName}
                onChange={formik.handleChange}
                value={formik.values.contractName}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <CustomAutocomplete
                  fieldError={Boolean(formik.errors.departmentId && formik.touched.departmentId)}
                  data={deptName}
                  name="departmentId"
                  label="Department Name"
                  onChange={handleDepartmentChange}
                  value={formik.values.departmentId}
                />
                <FormHelperText style={{ color: formik.touched.departmentId ? 'red' : '' }}>
                  {formik.errors.departmentId}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {/* Employee List */}

          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <CustomAutocomplete
                  fieldError={Boolean(formik.errors.employeeId && formik.touched.employeeId)}
                  data={empDrop}
                  name="employeeId"
                  label="Employee Name"
                  value={formik.values.employeeId}
                  onChange={(e: any, value: any) => {
                    formik.setFieldValue('employeeId', value);
                  }}
                />
                <FormHelperText style={{ color: formik.touched.employeeId ? 'red' : '' }}>
                  {formik.errors.employeeId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Client Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Client Name"
                  variant="outlined"
                  {...formik.getFieldProps('clientId')}
                  error={Boolean(formik.errors.clientId && formik.touched.clientId)}
                  onChange={formik.handleChange}
                  value={formik.values.clientId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {clientData?.length > 0 ? (
                    clientData.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.clientId}>
                          {item.clientName}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="">--</MenuItem>
                  )}
                </Select>
                <FormHelperText style={{ color: formik.touched.clientId ? 'red' : '' }}>{formik.errors.clientId}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...formik.getFieldProps('accounts')}
                  error={Boolean(formik.errors.accounts && formik.touched.accounts)}
                  label="Account Name"
                  variant="outlined"
                  onChange={formik.handleChange}
                >
                  {Object.entries(AccountTypeEnum).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.accounts ? 'red' : '' }}>{formik.errors.accounts}</FormHelperText>
              </FormControl>
            </Grid>
            {/* <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel style={{ color: formik.touched.marketPlaceAccountId ? 'red' : '' }} id="demo-simple-select-deptId">
                  Market Place Accounts
                </InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('marketPlaceAccountId')}
                  error={Boolean(formik.errors.marketPlaceAccountId && formik.touched.marketPlaceAccountId)}
                  label="Market Place Accounts"
                  value={formik.getFieldMeta('marketPlaceAccountId').value}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {marketplaceAccount &&
                    marketplaceAccount.length > 0 &&
                    marketplaceAccount?.map((item: any, key: number) => {
                      return (
                        <MenuItem value={item.id} key={key}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText style={{ color: formik.touched.marketPlaceAccountId ? 'red' : '' }}>
                  {formik.errors.marketPlaceAccountId}
                </FormHelperText>
              </FormControl>
            </Grid> */}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Market Place Accounts</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Market Place Accounts"
                  variant="outlined"
                  {...formik.getFieldProps('marketPlaceAccountId')}
                  error={Boolean(formik.errors.marketPlaceAccountId && formik.touched.marketPlaceAccountId)}
                  onChange={formik.handleChange}
                  value={formik.values.marketPlaceAccountId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {marketplaceAccount?.length > 0 ? (
                    marketplaceAccount.map((item: any, index: number) => {
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
                <FormHelperText style={{ color: formik.touched.marketPlaceAccountId ? 'red' : '' }}>
                  {formik.errors.marketPlaceAccountId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Contract Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="outlined"
                  {...formik.getFieldProps('contractType')}
                  error={Boolean(formik.errors.contractType && formik.touched.contractType)}
                  label="Contract Type"
                  onChange={formik.handleChange}
                >
                  {contractList.map((data: any, key: number) => {
                    return (
                      <MenuItem value={data.value} key={data.value}>
                        {data.label}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.contractType ? 'red' : '' }}>
                  {formik.errors.contractType}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Contract Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="outlined"
                  {...formik.getFieldProps('billingStatus')}
                  error={Boolean(formik.errors.billingStatus && formik.touched.billingStatus)}
                  label="BillingStatus"
                  onChange={formik.handleChange}
                >
                  {billingstatusList.map((data: any, key: number) => {
                    return (
                      <MenuItem value={data.value} key={data.value}>
                        {data.label}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.billingStatus ? 'red' : '' }}>
                  {formik.errors.billingStatus}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Billing Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="outlined"
                  label="Billing Type"
                  {...formik.getFieldProps('billingType')}
                  error={Boolean(formik.errors.billingType && formik.touched.billingType)}
                >
                  {Object.entries(BillingTypeEnum).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.billingType ? 'red' : '' }}>
                  {formik.errors.billingType}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="outlined"
                  {...formik.getFieldProps('status')}
                  error={Boolean(formik.errors.status && formik.touched.status)}
                  label="Contract Type"
                  onChange={formik.handleChange}
                >
                  {statusList.map((data: any, key: number) => {
                    return (
                      <MenuItem value={data.value} key={data.value}>
                        {data.label}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.contractType ? 'red' : '' }}>
                  {formik.errors.contractType}
                </FormHelperText>
              </FormControl>
            </Grid> */}
          </Grid>

          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Url"
                variant="outlined"
                size="small"
                {...formik.getFieldProps('projectUrl')}
                error={Boolean(formik.errors.projectUrl && formik.touched.projectUrl)}
                helperText={formik.errors.projectUrl}
                onChange={formik.handleChange}
                value={formik.values.projectUrl}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Review"
                variant="outlined"
                size="small"
                {...formik.getFieldProps('projectReview')}
                error={Boolean(formik.errors.projectReview && formik.touched.projectReview)}
                helperText={formik.errors.projectReview}
                onChange={formik.handleChange}
                value={formik.values.projectReview}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6} md={6}>
              <TextField
                id="startDate"
                fullWidth
                label="Start Date"
                type="date"
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...formik.getFieldProps('startDate')}
                error={Boolean(formik.errors.startDate && formik.touched.startDate)}
                helperText={formik.errors.startDate}
                onChange={formik.handleChange}
                value={formik.values.startDate}
              />
            </Grid>

            <Grid item xs={6} md={6}>
              <TextField
                id="endDate"
                fullWidth
                label="EndDate"
                size="small"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.errors.endDate && formik.touched.endDate)}
                helperText={formik.errors.endDate}
                {...formik.getFieldProps('endDate')}
                onChange={formik.handleChange}
                value={formik.values.endDate}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6} md={6}>
              <TextField
                id="hoursPerWeek"
                fullWidth
                label="Hours Per Week"
                type="text"
                size="small"
                variant="outlined"
                {...formik.getFieldProps('hoursPerWeek')}
                onChange={formik.handleChange}
                value={formik.values.hoursPerWeek}
                error={Boolean(formik.errors.hoursPerWeek && formik.touched.hoursPerWeek)}
                helperText={formik.errors.hoursPerWeek}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                id="CommunicationMode"
                fullWidth
                label="Communication Mode"
                type="text"
                size="small"
                variant="outlined"
                {...formik.getFieldProps('communicationMode')}
                onChange={formik.handleChange}
                value={formik.values.communicationMode}
                error={Boolean(formik.errors.communicationMode && formik.touched.communicationMode)}
                helperText={formik.errors.communicationMode}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="outlined"
                  label="Country"
                  {...formik.getFieldProps('country')}
                  value={formik.values.country || ''} // Ensure 'country' is not undefined
                  error={Boolean(formik.errors.country && formik.touched.country)}
                >
                  {countries &&
                    countries.length > 0 &&
                    countries.map((country) => (
                      <MenuItem key={country.label} value={country.label}>
                        {country.label}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText style={{ color: formik.touched.country ? 'red' : '' }}>{formik.errors.country}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label="Rating"
                type="text"
                id="rating"
                fullWidth
                size="small"
                variant="outlined"
                {...formik.getFieldProps('rating')}
                onChange={formik.handleChange}
                value={formik.values.rating}
              />
            </Grid>
          </Grid>
          <div className={classes.submitClose}>
            <PrimaryButton disabled={loading} startIcon={<GridCheckIcon />} variant="contained" type="submit">
              {loading ? 'Please Wait...' : 'Submit'}
            </PrimaryButton>
            <div className={classes.closeBtn}>
              <SecondayButton
                disabled={loading}
                startIcon={<GridCloseIcon />}
                variant="contained"
                onClick={() => handleCloseDialog()}
              >
                Close
              </SecondayButton>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
