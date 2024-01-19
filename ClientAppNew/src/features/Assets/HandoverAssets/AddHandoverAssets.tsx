import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { assetsSelector } from 'selectors/assets.selector';
import { empSelector } from 'selectors/emp.selector';
import { useFormik } from 'formik';
import handoverassetsService from 'services/assetHandoverService';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import CustomAutocomplete from 'components/molecules/CustomAutoComplete/CustomAutoComplete';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridAddIcon, GridCloseIcon } from '@mui/x-data-grid';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import useHandoverAssetStyles from './handoverAsset.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

const validationSchema = yup.object({
  assetId: yup.array().required('Asset Name is required!'),
  employeeId: yup.string().required('Employee Name is required!'),
  assignedDate: yup.date().required('Assigned Date is required!'),
});

export default function AddHandoverAssets({ isOpen, handleCloseDialog }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [assetName, setAssetName] = useState<any[]>([]);
  const [empDrop, setEmpDrop] = useState<any[]>([]);
  const [assetErr, setAssetErr] = useState(false);
  const [empErr, setEmpErr] = useState(false);
  const classes = useHandoverAssetStyles();
  const dispatch = useDispatch();
  const assetData = useSelector(assetsSelector);
  const employeeData = useSelector(empSelector);

  const formik = useFormik({
    initialValues: {
      handoverId: '',
      assetId: [],
      employeeId: '',
      assignedDate: '',
      identificationNumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const response = await handoverassetsService.handoverAsset(values);
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

      dispatch(handoverassetsService.fetchAssetsHadnoverList());
    },
  });

  useEffect(() => {
    console.log(assetData);

    const newArray =
      assetData &&
      assetData.length > 0 &&
      assetData?.map((asset: any, key: number) => ({
        label: asset.assetName ? asset.assetName : 'Name not Available',
        value: asset.assetId,
      }));
    setAssetName(newArray);
  }, [assetData]);

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
        <DialogTitle>
          <Typography align="center" component="span" variant="h5">
            Handover Asset To Employee
          </Typography>
        </DialogTitle>
        <Divider />
        <div id="formHandoverAsset">
          <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} style={{ marginBottom: 3 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <CustomAutocomplete
                    fieldError={Boolean(formik.errors.assetId && formik.touched.assetId)}
                    data={assetName}
                    name="assetId"
                    label="Asset Name"
                    value={formik.values.assetId}
                    onChange={(e: any, value: any) => {
                      const assetList = value.map((i: any) => i.value);
                      if (assetList.length <= 0) {
                        setAssetErr(true);
                      }
                      formik.setFieldValue('assetId', value);
                    }}
                  />
                  <FormHelperText style={{ color: formik.touched.employeeId ? 'red' : '' }}>
                    {formik.errors.employeeId}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="demo-simple-select-label">Employee Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Employee Name"
                    variant="outlined"
                    {...formik.getFieldProps('employeeId')}
                    error={Boolean(formik.errors.employeeId && formik.touched.employeeId)}
                    onChange={formik.handleChange}
                    value={formik.values.employeeId}
                    MenuProps={{
                      style: {
                        maxHeight: 400,
                      },
                    }}
                  >
                    {employeeData?.length > 0 ? (
                      employeeData.map((item: any, index: number) => {
                        return (
                          <MenuItem value={item.employeeId} key={index}>
                            {`${item.firstName} ${item.lastName}`}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem value="">--</MenuItem>
                    )}
                  </Select>
                  <FormHelperText style={{ color: formik.touched.employeeId ? 'red' : '' }}>
                    {formik.errors.employeeId}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  id="assignedDate"
                  fullWidth
                  label="Assigned Date"
                  type="date"
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('assignedDate')}
                  error={Boolean(formik.errors.assignedDate && formik.touched.assignedDate)}
                  helperText={formik.errors.assignedDate}
                  onChange={formik.handleChange}
                  value={formik.values.assignedDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="identificationNumber"
                  {...formik.getFieldProps('identificationNumber')}
                  onChange={formik.handleChange}
                  value={formik.values.identificationNumber}
                  label="Identification Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={Boolean(formik.errors.identificationNumber && formik.touched.identificationNumber)}
                  helperText={formik.errors.identificationNumber}
                />
              </Grid>
            </Grid>
            <div className={classes.submitClose}>
              <PrimaryButton disabled={loading} startIcon={<GridAddIcon />} variant="contained" type="submit">
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
    </>
  );
}
