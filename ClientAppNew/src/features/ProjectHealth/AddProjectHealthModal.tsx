import React, { useEffect, useState } from 'react';
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
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomAutocomplete from 'components/molecules/CustomAutoComplete/CustomAutoComplete';
import { clientSelector } from 'selectors/client.selector';
import Swal from 'sweetalert2';
import { ProjectHealthRateEnum } from 'Enums/ProjectHealthEnum/ProjectHealthEnum';
import projectService from 'services/project.Requets';
import { projectSelector } from 'selectors/project.selector';
import clientService from 'services/clientRequest';
import ProjectHealthService from 'services/projectHealth.Request';
import { projectHealthStyle } from './ProjectHealth.style';

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

const validationSchema = yup.object({
  date: yup.string().required('Date is required!'),
  clientId: yup.string().required('Client name is required!'),
  projectId: yup.string().required('Project name is required!'),
  projectHealthRate: yup.string().required('Project Health Rate is required!'),
  comments: yup.string(),
});

export default function AddProjectHealthModal({ isOpen, handleCloseDialog }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [clientDrop, setClientDrop] = useState<any[]>([]);
  const [projectDrop, setProjectDrop] = useState<any[]>([
    {
      label: 'Please Select a client',
      value: null,
    },
  ]);
  const dispatch = useDispatch();
  const projectData = useSelector(projectSelector);
  const clientData = useSelector(clientSelector);
  const classes = projectHealthStyle();
  const [errorMsg, setError] = useState(true);

  const formik = useFormik({
    initialValues: {
      date: '',
      clientId: '',
      projectId: '',
      projectHealthRate: '',
      comments: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setError(true);
      if (values.projectHealthRate !== 'Green' && !values.comments) {
        setError(false);
      } else {
        const response = await ProjectHealthService.addNewProjectHealth(values);
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

        dispatch(ProjectHealthService.fetchProjectHealthList());
      }
    },
  });

  useEffect(() => {
    if (clientData === null) {
      dispatch(clientService.fetchClientList());
    } else {
      const clientList =
        clientData?.length > 0 &&
        clientData?.map((client: any, key: number) => ({
          label: client.clientName,
          value: client.clientId,
        }));
      setClientDrop(clientList);
      console.log(clientDrop);
    }
    // console.log(clientDrop);
  }, [clientData, projectData]);

  // const clientProject: any[] = [];

  // if (formik.getFieldMeta('clientId').value) {
  //   for (let index1 = 0; index1 < projectData.length; index1++) {
  //     const element = projectData[index1];
  //     if (element.clientId === formik.getFieldMeta('clientId').value) {
  //       clientProject.push(element);
  //     }
  //   }
  // }

  const handleProjectChange = (e: any) => {
    formik.setFieldValue('projectId', e.target.value);
  };

  const handleClientChange = (e: any) => {
    console.log(projectData);

    if (projectData === null) {
      dispatch(projectService.fetchProjectList('all'));
    } else {
      const filterDept = projectData.filter((dept: { clientId: any }) => {
        return dept.clientId === e.target.value;
      });
      if (filterDept.length > 0) {
        const proData = filterDept.map((data: any, key: number) => ({
          label: data.contractName,
          value: data.id,
        }));
        setProjectDrop(proData);
      } else {
        const proData = [
          {
            label: 'No Project Found',
            value: null,
          },
        ];
        setProjectDrop(proData);
      }
    }

    formik.setFieldValue('clientId', e.target.value);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
      <DialogTitle>
        <Typography align="center" component="span" variant="h5">
          Add a new Project Health
        </Typography>
      </DialogTitle>
      <Divider />
      <div id="addConnectModal">
        <form className={classes.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-label">Client Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Client Name"
                  error={!!formik.errors.clientId}
                  onChange={handleClientChange}
                  value={formik.getFieldMeta('clientId').value}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {clientDrop?.length > 0 ? (
                    clientDrop.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="">--</MenuItem>
                  )}
                </Select>
                {formik.touched.clientId && formik.errors.clientId && (
                  <div className="fv-plugins-message-container">
                    <div className={`fv-help-block ${classes.labelError}`}>{formik.errors.clientId}</div>
                  </div>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="demo-simple-select-deptId">Project Name</InputLabel>
                <Select
                  labelId="demo-simple-select-deptId"
                  id="demo-select-deptId"
                  error={!!formik.errors.projectId}
                  label="Project Name"
                  {...formik.getFieldProps('projectId')}
                  // onChange={handleProjectChange}
                  value={formik.values.projectId}
                  MenuProps={{
                    style: {
                      maxHeight: 200,
                    },
                  }}
                >
                  {projectDrop &&
                    projectDrop.length > 0 &&
                    projectDrop?.map((project: any, key: number) => {
                      return (
                        <MenuItem value={project.value} key={key}>
                          {project.label}
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
                  error={!!formik.errors.projectHealthRate}
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
                fullWidth
                label="Comments"
                {...formik.getFieldProps('comments')}
                onChange={formik.handleChange}
                value={formik.values.comments}
                multiline
                variant="outlined"
                size="small"
                error={Boolean(formik.errors.comments && formik.touched.comments)}
                helperText={formik.errors.comments}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 3 }}>
            <Grid item xs={6}>
              {/* <InputLabel id="Connect_DateId">Connect Date</InputLabel> */}
              <TextField
                id="Connect_Date"
                fullWidth
                variant="outlined"
                size="small"
                type="date"
                label="Date"
                InputLabelProps={{
                  shrink: true,
                }}
                {...formik.getFieldProps('date')}
                onChange={formik.handleChange}
                value={formik.values.date}
                error={Boolean(formik.errors.date && formik.touched.date)}
                helperText={formik.errors.date}
              />
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
