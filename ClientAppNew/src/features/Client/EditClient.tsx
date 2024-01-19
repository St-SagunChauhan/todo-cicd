import React, { useState } from 'react';
import { Button, Grid, TextField, Dialog, DialogTitle, Typography, Divider, FormHelperText } from '@material-ui/core';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import clientService from 'services/clientRequest';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import { IDept } from 'features/Department/DeptModel';
import { marketPlaceAccountSelector } from 'selectors/marketPlaceAccount';
import { deptSelector } from 'selectors/dept.selector';
import { countries } from 'helpers/countries';
import { AccountType, AccountTypeEnum } from 'Enums/ProjectEnum/ProjectEnum';
import { Clients } from './ClientModel';
import useClientStyles from './client.styles';

type props = {
  client: Clients | undefined;
  handleCloseEdit: () => void;
  isOpenEdit: boolean;
  selectedDept?: string;
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const clientValidation = yup.object({
  clientName: yup.string().required('Client Name is required'),
  departmentId: yup.string().required('Department Name is required'),
  marketPlaceAccountId: yup.string().required('Market Place Accounts Name is required'),
  communication: yup.string(),
  country: yup.string().required('country is required').nullable(),
  clientEmail: yup.string().email('Invalid email country format'),
  contactNo: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
});

export default function EditClient({ handleCloseEdit, isOpenEdit, client, selectedDept }: props) {
  const [loading, setLoading] = useState(false);
  const classes = useClientStyles();
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const marketPlaceData = useSelector(marketPlaceAccountSelector);
  console.log(marketPlaceData, '----');

  const formik = useFormik({
    initialValues: {
      clientName: client?.clientName ?? '',
      departmentId: client?.departmentId ?? '',
      marketPlaceAccountId: client?.marketPlaceAccountId ?? '',
      // contactNo: client?.contactNo ?? '',
      communication: client?.communication ?? '',
      country: client?.country ?? '',
      clientEmail: client?.clientEmail ?? '',
      clientId: client?.clientId ?? '',
      accounts: client?.accounts ?? '',
      isActive: true,
    },
    validationSchema: clientValidation,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const response = await clientService.updateClient(values);
      setLoading(false);
      handleCloseEdit();
      resetForm();
      // dispatch(clientService.fetchClientList(selectedDept || null));

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
      dispatch(clientService.fetchClientList(deptFilter));
    },
  });

  return (
    <Dialog fullWidth maxWidth="md" open={isOpenEdit} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Edit client
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromClientDetails">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Client Name"
                {...formik.getFieldProps('clientName')}
                error={Boolean(formik.errors.clientName && formik.touched.clientName)}
                helperText={formik.errors.clientName}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-deptId">Department</InputLabel>
                {deptData && deptData.length && (
                  <>
                    <Select
                      labelId="demo-simple-select-deptId"
                      id="demo-select-deptId"
                      {...formik.getFieldProps('departmentId')}
                      label="Department"
                      value={formik.values.departmentId}
                      error={Boolean(formik.errors.departmentId && formik.touched.departmentId)}
                      MenuProps={{
                        style: {
                          maxHeight: 400,
                        },
                      }}
                    >
                      {deptData?.map((dept: IDept, key: number) => {
                        return (
                          <MenuItem value={dept.departmentId} key={key}>
                            {dept.departmentName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText style={{ color: formik.touched.departmentId ? 'red' : '' }}>
                      {formik.errors.departmentId}
                    </FormHelperText>
                  </>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-deptId">Market Place Accounts</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('marketPlaceAccountId')}
                  label="Market Place Accounts"
                  value={formik.values.marketPlaceAccountId}
                  error={Boolean(formik.errors.marketPlaceAccountId && formik.touched.marketPlaceAccountId)}
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
                <InputLabel id="demo-simple-select-deptId">Account Type</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('accounts')}
                  error={Boolean(formik.errors.accounts && formik.touched.accounts)}
                  label="Account Type"
                  value={formik.values.accounts}
                >
                  {AccountType.map((key, index) => {
                    return (
                      <MenuItem value={key} key={index}>
                        {AccountTypeEnum[key]}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: formik.touched.accounts ? 'red' : '' }}>{formik.errors.accounts}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Email"
                {...formik.getFieldProps('clientEmail')}
                error={Boolean(formik.errors.clientEmail && formik.touched.clientEmail)}
                helperText={formik.errors.clientEmail}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Communication"
                {...formik.getFieldProps('communication')}
                error={Boolean(formik.errors.communication && formik.touched.communication)}
                helperText={formik.errors.communication}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="country"
                autoHighlight
                options={countries.map((country) => country.label)}
                {...formik.getFieldProps('country')}
                onChange={(e, value) => formik.setFieldValue('country', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    label="Country"
                    error={Boolean(formik.errors.country && formik.touched.country)}
                    helperText={formik.errors.country}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
            <div className={classes.submitClose}>
              <PrimaryButton startIcon={<GridCheckIcon />} type="submit">
                {loading ? 'Please Wait...' : 'Submit'}
              </PrimaryButton>
              <div className={classes.closeBtn}>
                <SecondayButton startIcon={<GridCloseIcon />} onClick={handleCloseEdit}>
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
