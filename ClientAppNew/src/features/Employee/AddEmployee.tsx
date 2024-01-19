import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import deptService from 'services/dept.Request';
import { deptSelector } from 'selectors/dept.selector';
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
  Avatar,
  Box,
  FormHelperText,
} from '@material-ui/core';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import { IDept } from 'features/Department/DeptModel';
import Swal from 'sweetalert2';
import { GenderEnum, Role, RoleEnum } from 'Enums/EmployeeEnum/EmployeeEnum';
import { empSelector } from 'selectors/emp.selector';
import { useEmpStyles } from './emp.styles';
import profileImg from '../../assets/images/Profile.png';

type props = {
  handleClose: () => void;
  isOpenEmployee: boolean;
  empData: any;
};

const phoneRegExp = RegExp(
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
);

const empValidation = yup.object({
  // password: yup.string().required('Password is required'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is Required'),
  address: yup.string().required('Address is required'),
  gender: yup.string().required('Gender is required'),
  email: yup.string().email('Invalid email address format').required('Email Address is required'),
  mobileNo: yup
    .string()
    .matches(phoneRegExp, 'Enter a Valid Number')
    .length(10, 'Enter 10 Digit Mobile Number')
    .required('Please enter 10 digit valid mobile number'),
  createdBy: yup.string(),
  isActive: yup.string(),
  joiningDate: yup.date().required('Joining Date is required'),
  resignationDate: yup.date().min(yup.ref('joiningDate'), 'Joining Date Should be Older then Resignation Date').nullable(),
  departmentId: yup.string().required('Department is required'),
  role: yup.string().required('Role is required'),
  employeeNumber: yup.string().required('Employee Number is required'),
  casualLeaves: yup.string().typeError('Please Enter Leaves in number').required('Casual Leave(s) required'),
  sickLeaves: yup.string().typeError('Please Enter Leaves in number').required('Sick Leave(s) required'),
});

export default function AddEmployee({ handleClose, isOpenEmployee, empData }: props) {
  const classes = useEmpStyles();
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const employeeData = useSelector(empSelector);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [errorMsg, setError] = useState();
  const [errorMsgs, setErrors] = useState();
  const [errorMsgMob, setErrorMsgMob] = useState();
  const departmentEmployees: any[] = [];
  const [num, setNum] = React.useState();

  const formik = useFormik({
    initialValues: {
      // password: '',
      firstName: '',
      lastName: '',
      address: '',
      gender: '',
      email: '',
      mobileNo: '',
      createdBy: '',
      departmentId: '',
      assignedTo: '',
      isActive: true,
      employeeNumber: '',
      sickLeaves: '',
      casualLeaves: '',
      role: '',
      joiningDate: '',
      resignationDate: '' || null,
      employeeId: '00000000-0000-0000-0000-000000000000',
      employeeTargetedHours: null,
      profilePicture: '',
    },

    validationSchema: empValidation,
    onSubmit: async (values, { resetForm }) => {
      const IsEmpexists = empData.some((x: { email: string }) => x.email === values.email);
      const IsEmpNoexists = empData.some((x: { employeeNumber: string }) => x.employeeNumber === values.employeeNumber);
      const IsEmpMobNoexists = empData.some((x: { mobileNo: string }) => x.mobileNo === values.mobileNo);
      setError(IsEmpexists);
      setErrors(IsEmpNoexists);
      setErrorMsgMob(IsEmpMobNoexists);

      // if (values.profilePicture) {
      //   const idCardBase64: any = await getBase64(values.profilePicture, '');
      //   values.profilePicture = idCardBase64;
      // }

      if (!IsEmpexists && !IsEmpNoexists && !IsEmpMobNoexists) {
        setLoading(true);
        const response = await empService.createEmployee(values);
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

        dispatch(empService.fetchEmpList());
      }
    },
  });

  // async function getBase64(file: any, cb: any) {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = function () {
  //         const base64String = reader.result as string;
  //         base64String.split(',')[1].trim();
  //         setImages(base64String);
  //         resolve(base64String.split(',')[1].trim());
  //       };

  //       reader.onerror = function (error) {};
  //     }, 2000);
  //   });
  // }

  if (formik.getFieldMeta('departmentId').value) {
    const teamLead = employeeData.find((obj: { role: string; any: any }) => {
      return obj.role === 'TeamLead';
    });

    for (let index1 = 0; index1 < employeeData.length; index1++) {
      const element = employeeData[index1];
      if (element.departmentId === formik.getFieldMeta('departmentId').value) {
        if (element.assignedTo == null) {
          element.assignedTo = teamLead.employeeId;
        }
        departmentEmployees.push(element);
      }
    }
  }

  const handleDepartmentChange = (e: any) => {
    for (let index = 0; index < employeeData.length; index++) {
      const element = employeeData[index];
      if (element.departmentId === e.target.value) {
        departmentEmployees.push(element);
      }
    }

    formik.setFieldValue('departmentId', e.target.value);
  };

  const handleImageChange = (e: any) => {
    const fileList = Array.from(e.target.files);
    fileList.forEach((file: any, i) => {
      const reader = new FileReader();
      console.log(file);

      reader.onloadend = () => {
        const result = reader.result as string;
        setImages([reader.result]);
        formik.setFieldValue('profilePicture', result.split(',')[1].trim());
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    dispatch(deptService.fetchDepartmentList());
    setImages(profileImg);
  }, [dispatch]);

  const ALPHA_NUMERIC_DASH_REGEX = /^[a-zA-Z0-9]+$/;

  return (
    <Dialog fullWidth maxWidth="md" open={isOpenEmployee} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Employee
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromClientDetails">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container item style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
            <Box style={{ maxWidth: '20%' }}>
              <Grid
                item
                xs={12}
                className={classes.uploadImg}
                style={{ marginBottom: 2, border: 'none', backgroundColor: '#f1416c' }}
              >
                <Button component="label" className={classes.uploadBtn}>
                  <div className={classes.iconLabel}>
                    <div>
                      <input
                        id="file"
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg"
                        onChange={(event) => {
                          formik.setFieldValue(
                            'profilePicture',
                            event.currentTarget.files?.length && event.currentTarget.files[0],
                          );
                          handleImageChange(event);
                        }}
                      />
                      {images ? (
                        <>
                          <div>
                            <Avatar
                              style={{
                                width: '100px',
                                height: '100px',
                              }}
                            >
                              <img alt="" height="100%" width="100%" src={images} />
                            </Avatar>
                            <InputLabel
                              style={{
                                marginTop: '5px',
                                display: 'flex',
                                justifyContent: 'center',
                                fontWeight: '700',
                                color: '#fff',
                              }}
                              htmlFor="imageUpload"
                            >
                              Profile pic
                            </InputLabel>
                          </div>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </Button>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Employee Number"
                onKeyDown={(event) => {
                  if (!ALPHA_NUMERIC_DASH_REGEX.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                {...formik.getFieldProps('employeeNumber')}
                error={Boolean(formik.errors.employeeNumber && formik.touched.employeeNumber)}
                helperText={formik.errors.employeeNumber}
              />

              {errorMsgs && <p style={{ color: 'red', fontSize: '12px' }}>EmployeeNumber Already exists</p>}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Email Address"
                {...formik.getFieldProps('email')}
                error={Boolean(formik.errors.email && formik.touched.email)}
                helperText={formik.errors.email}
              />

              {errorMsg && <p style={{ color: 'red', fontSize: '12px' }}>Email Already exists</p>}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="First Name"
                {...formik.getFieldProps('firstName')}
                error={Boolean(formik.errors.firstName && formik.touched.firstName)}
                helperText={formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Last Name"
                {...formik.getFieldProps('lastName')}
                error={Boolean(formik.errors.lastName && formik.touched.lastName)}
                helperText={formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                label="Mobile No"
                {...formik.getFieldProps('mobileNo')}
                error={Boolean(formik.errors.mobileNo && formik.touched.mobileNo)}
                helperText={formik.errors.mobileNo}
              />
              {errorMsgMob && <p style={{ color: 'red', fontSize: '12px' }}>Mobile number Already exists</p>}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Address"
                {...formik.getFieldProps('address')}
                error={Boolean(formik.errors.address && formik.touched.address)}
                helperText={formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-helper-label">Department</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Department"
                  onChange={handleDepartmentChange}
                  value={formik.getFieldMeta('departmentId').value}
                  error={Boolean(formik.errors.departmentId && formik.touched.departmentId)}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {deptData &&
                    deptData.length &&
                    deptData?.map((dept: IDept, key: number) => {
                      return (
                        <MenuItem value={dept.departmentId || undefined} key={key}>
                          {dept.departmentName}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText style={{ color: formik.touched.departmentId ? 'red' : '' }}>
                  {formik.errors.departmentId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Assigned To"
                  {...formik.getFieldProps('assignedTo')}
                  value={formik.values.assignedTo}
                  MenuProps={{
                    style: {
                      maxHeight: 200,
                    },
                  }}
                >
                  {departmentEmployees?.length > 0 ? (
                    departmentEmployees.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.employeeId}>
                          {item.firstName}&nbsp;{item.lastName}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" style={{ color: 'red' }}>
                      Please Select A Department First!
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="text"
                label="Casual Leaves"
                {...formik.getFieldProps('casualLeaves')}
                error={Boolean(formik.errors.casualLeaves && formik.touched.casualLeaves)}
                helperText={formik.errors.casualLeaves}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="text"
                label="Sick Leaves"
                {...formik.getFieldProps('sickLeaves')}
                error={Boolean(formik.errors.sickLeaves && formik.touched.sickLeaves)}
                helperText={formik.errors.sickLeaves}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-helper-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                  {...formik.getFieldProps('gender')}
                  error={Boolean(formik.errors.gender && formik.touched.gender)}
                >
                  {Object.keys(GenderEnum).map((key, index) => {
                    return (
                      <MenuItem value={key} key={index}>
                        {key}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.gender ? 'red' : '' }}>{formik.errors.gender}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Role"
                  {...formik.getFieldProps('role')}
                  error={Boolean(formik.errors.role && formik.touched.role)}
                >
                  {Role.map((key, index) => {
                    return (
                      <MenuItem value={key} key={index}>
                        {RoleEnum[key]}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.role ? 'red' : '' }}>{formik.errors.role}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                id="date"
                label="Joining Date"
                type="date"
                defaultValue="mm/dd/yyyy"
                InputLabelProps={{ shrink: true }}
                className={classes.textField}
                {...formik.getFieldProps('joiningDate')}
                error={Boolean(formik.errors.joiningDate && formik.touched.joiningDate)}
                helperText={formik.errors.joiningDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Resignation Date"
                id="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                className={classes.textField}
                {...formik.getFieldProps('resignationDate')}
                error={Boolean(formik.errors.resignationDate && formik.touched.resignationDate)}
                helperText={formik.errors.resignationDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="text"
                label="Employee Hours"
                {...formik.getFieldProps('employeeTargetedHours')}
                error={Boolean(formik.errors.employeeTargetedHours && formik.touched.employeeTargetedHours)}
                helperText={formik.errors.employeeTargetedHours}
              />
            </Grid>
            <div className={classes.submitClose}>
              <PrimaryButton startIcon={<GridCheckIcon />} type="submit">
                {loading ? 'Please Wait...' : 'Submit'}
              </PrimaryButton>
              <div className={classes.closeBtn}>
                <SecondayButton startIcon={<GridCloseIcon />} onClick={handleClose}>
                  Close
                </SecondayButton>
              </div>
            </div>
          </Grid>
        </form>
      </div>
    </Dialog>
  );
}
