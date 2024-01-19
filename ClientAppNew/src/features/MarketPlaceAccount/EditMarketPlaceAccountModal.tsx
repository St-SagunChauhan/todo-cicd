import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import marketPlaceAccountService from 'services/marketPlaceAccount.Request';
import { marketPlaceAccountStyles } from './marketPlaceAccount.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
};

const validationSchema = yup.object({
  name: yup.string().required('Upwork-Id is required!'),
});

export default function EditDeptModel({ isOpen, handleCloseDialog, data }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [errorMsg] = useState();
  const classes = marketPlaceAccountStyles();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: data?.name,
      address: data?.address,
      password: data?.password,
      accounts: data?.accounts,
      id: data?.id,
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const response = await marketPlaceAccountService.updateMarketPlaceAccount(values);
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

      dispatch(marketPlaceAccountService.fetchMarketPlaceAccountList());
    },
  });

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Edit Market Place Account
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="fromAddNewUsername">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="UpWork-Id"
                {...formik.getFieldProps('name')}
                error={Boolean(formik.errors.name && formik.touched.name)}
                helperText={formik.errors.name}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {errorMsg && <p style={{ color: 'red' }}>User Alredy exists</p>}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Accounts</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...formik.getFieldProps('accounts')}
                  error={Boolean(formik.errors.accounts && formik.touched.accounts)}
                  label="Accounts"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Agency">Agency</MenuItem>
                  <MenuItem value="Freelancer">Freelancer</MenuItem>
                  <MenuItem value="AgencyAndFreelancer">AgencyandFreelancer</MenuItem>
                </Select>
                <FormHelperText style={{ color: formik.touched.accounts ? 'red' : '' }}>{formik.errors.accounts}</FormHelperText>
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
