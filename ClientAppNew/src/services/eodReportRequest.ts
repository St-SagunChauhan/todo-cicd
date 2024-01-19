import axios from 'axios';
import { Dispatch } from 'redux';
import { IEodReportActionTypes } from 'features/EodReport/EodReportModel';
import authService from './authService';
import projectService from './project.Requets';
import deptService from './dept.Request';
import empService from './emp.Request';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class EodReportService {
  fetchEodReportList =
    (startDate?: string | null, endDate?: string | null, dept?: string | null) => (dispatch: Dispatch<any>) => {
      // Get department list
      dispatch(projectService.fetchProjectList());
      dispatch(deptService.fetchDepartmentList());
      dispatch(empService.fetchEmpList());

      dispatch({
        type: IEodReportActionTypes.EOD_REPORT_REQUEST,
      });

      axios
        .post(
          `${baseURL}/EodReport/getEodReports`,
          {
            startDate: startDate ?? null,
            endDate: endDate ?? null,
          },
          {
            headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
          },
        )
        .then((response) => {
          dispatch({
            type: IEodReportActionTypes.EOD_REPORT_SUCCESS,
            payload: { data: response.data },
          });
        })
        .catch((error) => {
          dispatch({
            type: IEodReportActionTypes.EOD_REPORT_FAILURE,
            payload: { msg: error },
          });
        });
    };

  addEodReport = async (value: any) => {

    // Create an array of project hours with projectId and billingHours
    const projectHoursArray = value.projectHours.map((hour: any) => ({
      projectId: hour.projectId,
      billingHours: hour.billingHours,
    }));

    // Create an array of employee hours with employeeDelightHours
    const employeeHoursArray = value.employeeHours.map((hour: any) => ({
      projectId: hour.projectId,
      employeeDelightHours: hour.employeeDelightHours,
    }));

    const data = {
      employeeId: value.employeeId,
      departmentId: value.departmentId,
      eodDate: value.eodDate,
      unbilledHours: value.unbilledHours,
      projectHours: projectHoursArray,      // Use the modified arrays
      employeeHours: employeeHoursArray,    // Use the modified arrays
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(`${baseURL}/EodReport/createEodReport`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteEodReport = async (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = await axios
      .delete(`${baseURL}/EodReport/${value}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateEodReport = async (value: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = await axios
      .put(`${baseURL}/EodReport/updateEodReport`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const eodReportService = new EodReportService();

export default eodReportService;
