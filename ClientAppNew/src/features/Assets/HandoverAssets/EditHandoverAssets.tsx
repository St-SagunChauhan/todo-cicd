import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assetsSelector } from 'selectors/assets.selector';
import { useFormik } from 'formik';
import { empSelector } from 'selectors/emp.selector';
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
import assetsService from 'services/assetsServices';
import PrimaryButton from 'components/molecules/Buttons/PrimaryButton';
import { GridCheckIcon, GridCloseIcon } from '@mui/x-data-grid';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import useHandoverAssetStyles from './handoverAsset.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
};

export default function EditHandoverAssets({ isOpen, handleCloseDialog, data }: IProps) {
  console.log(data);

  const [loading, setLoading] = useState(false);
  const [assetName, setAssetName] = useState<any[]>([]);
  const classes = useHandoverAssetStyles();
  const dispatch = useDispatch();
  const assetData = useSelector(assetsSelector);
  const employeeData = useSelector(empSelector);

  const formik = useFormik({
    initialValues: {
      handoverId: data?.handoverId,
      assetId: data?.assetId ?? 'all',
      employeeId: data?.employeeId ?? '',
      assignedDate: data?.assignedDate ?? '',
      identificationNumber: data?.identificationNumber ?? '',
    },
    onSubmit: async (values, { resetForm }) => {
      const response = await handoverassetsService.updateAssetHandoveredRecord(values);
      setLoading(false);
      handleCloseDialog();
      resetForm();
      dispatch(handoverassetsService.fetchAssetsHadnoverList());

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
    },
  });

  const handleAssetChange = (e: any, value: any) => {
    const assetFilter = value && value.map((i: any) => i.value);
    dispatch(assetsService.fetchAssetsList());
    formik.setFieldValue('assetId', value);
  };

  // useEffect(() => {
  //   const newArray = assetData?.map((asset: any, key: number) => ({
  //     label: asset.assetName ? asset.assetName : 'No Name',
  //     value: asset.assetId,
  //   }));
  //   setAssetName(newArray);
  // }, [assetData]);

  // useEffect(() => {
  //   const newAssetArr =
  //     data.assetId &&
  //     data.assetId.map((id: any, index: number) => ({
  //       value: id,
  //       label: data.assetName ? data.assetName : 'No Name',
  //     }));
  // formik.setFieldValue('assetId', assetId);
  // }, []);

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
        <DialogTitle>
          <Typography align="center" component="span" variant="h5">
            Edit Handover Asset
          </Typography>
        </DialogTitle>
        <Divider />
        <div id="editHandoverAssetForm">
          <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} style={{ marginBottom: 3 }}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="demo-simple-select-label">Asset Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Asset Name"
                    variant="outlined"
                    {...formik.getFieldProps('assetId')}
                    error={Boolean(formik.errors.assetId && formik.touched.assetId)}
                    onChange={formik.handleChange}
                    value={formik.values.assetId}
                    MenuProps={{
                      style: {
                        maxHeight: 400,
                      },
                    }}
                  >
                    {assetData?.length > 0 ? (
                      assetData.map((item: any, index: number) => {
                        return (
                          <MenuItem value={item.assetId} key={index}>
                            {item.assetName}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem value="">--</MenuItem>
                    )}
                  </Select>
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
              <Grid item xs={6} md={6}>
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
    </>
  );
}
