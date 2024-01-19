import React, { useState, useEffect } from 'react';
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
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import { marketPlaceAccountSelector } from 'selectors/marketPlaceAccount';
import { empSelector } from 'selectors/emp.selector';
import { deptSelector } from 'selectors/dept.selector';
import connectService from 'services/connect.Request';
import { BidStatusEnum } from 'Enums/ConnectEnum/BidStatusEnum';
import { connectStyle } from './connect.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

const validationSchema = yup.object({
  employeeId: yup.string().required('Employee name is required!'),
  departmentId: yup.string().required('Department name is required!'),
  marketPlaceAccountId: yup.string().required('Market place name is required!'),
  connectUsed: yup.number().typeError('Please enter Connect Uses in Number').required('Connect used is required!'),
  marketingQualifiedLeads: yup.number().typeError('Please Enter in Number'),
  salesQualifiedLeads: yup.number().typeError('Please Enter in Number'),
  dealsWon: yup.number().typeError('Please Enter in Number'),
  connect_Date: yup.date().required('Connect date is required!'),
  bidStatus: yup.string().required('Status is required!'),
  jobUrl: yup.string().required('Job URL is required!'),
  technology: yup.string(),
});

export default function AddConnectModal({ isOpen, handleCloseDialog }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const empData = useSelector(empSelector);
  const [empList, setEmpList] = useState([]);
  const marketPlaceData = useSelector(marketPlaceAccountSelector);
  const classes = connectStyle();

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      departmentId: '',
      marketPlaceAccountId: '',
      connectUsed: null,
      connect_Date: '',
      bidStatus: '',
      isActive: true,
      jobUrl: '',
      salesQualifiedLeads: null,
      marketingQualifiedLeads: null,
      dealsWon: null,
      technology: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      values.salesQualifiedLeads = values.salesQualifiedLeads == '' ? null : values.salesQualifiedLeads;
      values.marketingQualifiedLeads = values.marketingQualifiedLeads == '' ? null : values.marketingQualifiedLeads;
      values.dealsWon = values.dealsWon == '' ? null : values.dealsWon;
      const response = await connectService.addNewConnect(values);
      setLoading(true);
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

      dispatch(connectService.fetchConnectList());
    },
  });

  useEffect(() => {
    console.log(formik.errors);
  }, [formik]);

  const handelEmpChange = (e: any) => {
    formik.setFieldValue('employeeId', e.target.value);
    const getEmp = empData.filter((emp: any) => {
      return emp.employeeId === e.target.value;
    });
    console.log(getEmp[0]);

    formik.setFieldValue('departmentId', getEmp[0].departmentId);
  };

  const handleDeptChange = (e: any) => {
    formik.setFieldValue('departmentId', e.target.value);
    const getEmp = empData.filter((emp: any) => {
      return emp.departmentId === e.target.value;
    });
    setEmpList(getEmp);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Connect
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="addConnectModal">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ color: formik.errors.departmentId && formik.touched.departmentId ? 'red' : '' }}
                  id="demo-simple-select-deptId"
                >
                  Department Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  // {...formik.getFieldProps('departmentId')}
                  onChange={handleDeptChange}
                  error={Boolean(formik.errors.departmentId && formik.touched.departmentId)}
                  label="Department Name"
                  value={formik.values.departmentId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
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
                <FormHelperText style={{ color: formik.touched.departmentId ? 'red' : '' }}>
                  {formik.errors.departmentId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ color: formik.errors.employeeId && formik.touched.employeeId ? 'red' : '' }}
                  id="demo-simple-select-deptId"
                >
                  Employee Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  // {...formik.getFieldProps('employeeId')}
                  onChange={handelEmpChange}
                  error={Boolean(formik.errors.employeeId && formik.touched.employeeId)}
                  label="Employee Name"
                  value={formik.values.employeeId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {empList &&
                    empList.length > 0 &&
                    empList?.map((emp: any, key: number) => {
                      return (
                        <MenuItem value={emp.employeeId} key={key}>
                          {`${emp.firstName} ${emp.lastName}`}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText style={{ color: formik.touched.employeeId ? 'red' : '' }}>
                  {formik.errors.employeeId}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                label="Connects"
                {...formik.getFieldProps('connectUsed')}
                error={Boolean(formik.errors.connectUsed && formik.touched.connectUsed)}
                helperText={formik.errors.connectUsed}
                onChange={formik.handleChange}
                value={formik.values.connectUsed}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                label="Job Url"
                {...formik.getFieldProps('jobUrl')}
                error={Boolean(formik.errors.jobUrl && formik.touched.jobUrl)}
                helperText={formik.errors.jobUrl}
                onChange={formik.handleChange}
                value={formik.values.jobUrl}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                label="Sales Qualified Lead"
                {...formik.getFieldProps('salesQualifiedLeads')}
                error={Boolean(formik.errors.salesQualifiedLeads && formik.touched.salesQualifiedLeads)}
                helperText={formik.errors.salesQualifiedLeads}
                onChange={formik.handleChange}
                value={formik.values.salesQualifiedLeads}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                label="Marketing Qualified Lead"
                {...formik.getFieldProps('marketingQualifiedLeads')}
                error={Boolean(formik.errors.marketingQualifiedLeads && formik.touched.marketingQualifiedLeads)}
                helperText={formik.errors.marketingQualifiedLeads}
                onChange={formik.handleChange}
                value={formik.values.marketingQualifiedLeads}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                label="Deals Won"
                {...formik.getFieldProps('dealsWon')}
                error={Boolean(formik.errors.dealsWon && formik.touched.dealsWon)}
                helperText={formik.errors.dealsWon}
                onChange={formik.handleChange}
                value={formik.values.dealsWon}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                label="Technology"
                {...formik.getFieldProps('technology')}
                error={Boolean(formik.errors.technology && formik.touched.technology)}
                helperText={formik.errors.technology}
                onChange={formik.handleChange}
                value={formik.values.technology}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <TextField
                id="connect_Date"
                variant="outlined"
                size="small"
                fullWidth
                label="Connect_Date"
                InputLabelProps={{ shrink: true }}
                type="date"
                {...formik.getFieldProps('connect_Date')}
                error={Boolean(formik.errors.connect_Date && formik.touched.connect_Date)}
                helperText={formik.errors.connect_Date}
                onChange={formik.handleChange}
                value={formik.values.connect_Date}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ color: formik.errors.marketPlaceAccountId && formik.touched.marketPlaceAccountId ? 'red' : '' }}
                  id="demo-simple-select-deptId"
                >
                  Market Place Accounts
                </InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('marketPlaceAccountId')}
                  error={Boolean(formik.errors.marketPlaceAccountId && formik.touched.marketPlaceAccountId)}
                  label="Market Place Accounts"
                  value={formik.values.marketPlaceAccountId}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {marketPlaceData &&
                    marketPlaceData.length > 0 &&
                    marketPlaceData?.map((item: any, key: number) => {
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
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ color: formik.errors.bidStatus && formik.touched.bidStatus ? 'red' : '' }}
                  id="demo-simple-select-leaveId"
                >
                  Connect Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-leaveId"
                  id="demo-select-leaveId"
                  {...formik.getFieldProps('bidStatus')}
                  error={Boolean(formik.errors.bidStatus && formik.touched.bidStatus)}
                  label="Contact Status"
                  value={formik.values.bidStatus}
                >
                  {Object.entries(BidStatusEnum).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.bidStatus ? 'red' : '' }}>
                  {formik.errors.bidStatus}
                </FormHelperText>
              </FormControl>
            </Grid>
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
