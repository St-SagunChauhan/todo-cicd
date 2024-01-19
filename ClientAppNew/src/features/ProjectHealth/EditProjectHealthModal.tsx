import React, { useState } from 'react';
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
  Select,
  MenuItem,
  Divider,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ProjectHealthRateEnum } from 'Enums/ProjectHealthEnum/ProjectHealthEnum';
import { clientSelector } from 'selectors/client.selector';
import { projectSelector } from 'selectors/project.selector';
import projectHealthService from 'services/projectHealth.Request';
import { projectHealthStyle } from './ProjectHealth.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: any;
  selectedDept?: string;
};

const validationSchema = yup.object({
  clientId: yup.string().required('Client name is required!'),
  projectId: yup.string().required('Project name is required!'),
  projectHealthRate: yup.string().required('Project Health Rate is required!'),
  comments: yup.string(),
  date: yup.string().required('Date is required!'),
});

export default function EditProjectHealthModel({ isOpen, handleCloseDialog, data, selectedDept }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const projectData = useSelector(projectSelector);
  const classes = projectHealthStyle();
  const clientData = useSelector(clientSelector);
  const [errorMsg, setError] = useState(true);

  const formik = useFormik({
    initialValues: {
      id: data?.id,
      clientId: data?.clientId ?? '',
      projectId: data?.projectId ?? '',
      projectHealthRate: data?.projectHealthRate ?? '',
      comments: data?.comments ?? '',
      date: data?.date ? moment(data?.date).format('YYYY-MM-DD') : '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (values.projectHealthRate !== 'Green' && !values.comments) {
        setError(false);
      } else {
        setLoading(true);
        const response = await projectHealthService.updateProjectHealth(values);

        setLoading(false);
        handleCloseDialog();
        resetForm();
        dispatch(projectHealthService.fetchProjectHealthList(selectedDept || null));

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
        dispatch(projectHealthService.fetchProjectHealthList(deptFilter));
      }
    },
  });

  const clientProject: any[] = [];

  if (formik.getFieldMeta('clientId').value) {
    for (let index1 = 0; index1 < projectData.length; index1++) {
      const element = projectData[index1];
      if (element.clientId === formik.getFieldMeta('clientId').value) {
        clientProject.push(element);
      }
    }
  }

  const handleClientChange = (e: any) => {
    for (let index = 0; index < projectData.length; index++) {
      const element = projectData[index];
      if (element.clientId === e.target.value) {
        clientProject.push(element);
      }
    }
    formik.setFieldValue('clientId', e.target.value);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Edit Project Health
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="addConnectModal">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-deptId">Client Name</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  label="Client Name"
                  onChange={handleClientChange}
                  value={formik.values.clientId}
                  MenuProps={{
                    style: {
                      maxHeight: 200,
                    },
                  }}
                >
                  {clientData &&
                    clientData.length > 0 &&
                    clientData?.map((clients: any, key: number) => {
                      return (
                        <MenuItem value={clients.clientId} key={key}>
                          {clients.clientName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              {formik.touched.clientId && formik.errors.clientId && (
                <div className="fv-plugins-message-container">
                  <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.clientId}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-deptId">Project Name</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('projectId')}
                  label="Project Name"
                  value={formik.values.projectId}
                  MenuProps={{
                    style: {
                      maxHeight: 200,
                    },
                  }}
                >
                  {clientProject &&
                    clientProject.length > 0 &&
                    clientProject?.map((project: any, key: number) => {
                      return (
                        <MenuItem value={project.id} key={key}>
                          {project.contractName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              {formik.touched.projectId && formik.errors.projectId && (
                <div className="fv-plugins-message-container">
                  <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.projectId}</div>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-deptId">Project Health Rate</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  {...formik.getFieldProps('projectHealthRate')}
                  label="projectHealthRate"
                  value={formik.values.projectHealthRate}
                >
                  {Object.entries(ProjectHealthRateEnum).map(([key, val]) => {
                    return (
                      <MenuItem value={key} key={key}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {formik.touched.projectHealthRate && formik.errors.projectHealthRate && (
                <div className="fv-plugins-message-container">
                  <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.projectHealthRate}</div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                label="Comments"
                {...formik.getFieldProps('comments')}
                onChange={formik.handleChange}
                value={formik.values.comments}
              />
              {errorMsg ? '' : <p style={{ color: 'red', marginTop: 2, marginBottom: 0 }}>Comment is required!</p>}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* <InputLabel id="Connect_DateId">Connect Date</InputLabel> */}
              <TextField
                variant="outlined"
                size="small"
                id="Date"
                fullWidth
                label="Date"
                type="date"
                {...formik.getFieldProps('date')}
                onChange={formik.handleChange}
                value={formik.values.date}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="fv-plugins-message-container">
                  <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.date}</div>
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
                onClick={() => handleCloseDialog()}
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
