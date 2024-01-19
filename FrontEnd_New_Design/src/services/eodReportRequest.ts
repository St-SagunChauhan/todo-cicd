import axios from "axios";
import { Dispatch } from "redux";
import { IEodReportActionTypes } from "../models/IEodReportState";
import authService from "./authServices";
import projectService from "./projectRequest";
import deptService from "./deptRequest";
import empService from "./empRequest";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};
class EodReportService {
  fetchEodReportList =
    (
      startDate?: string | null,
      endDate?: string | null,
      dept?: string | null
    ) =>
      (dispatch: Dispatch<any>) => {
        dispatch({
          type: IEodReportActionTypes.EOD_REPORT_REQUEST,
        });

        axios
          .post(
            `${baseURL}/EodReport/getEodReports`,
            {
              endDate: endDate ?? null,
              startDate: startDate ?? null,
              departmentId: dept ?? null,
            },
            {
              headers: {
                Authorization: `Bearer ${authService.getAccessToken()}`,
              },
            }
          )
          .then((response) => {
            console.log(response);

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

  addEodReport = async (Value: any) => {
    // Create an array of project hours with projectId and billingHours
    const projectHoursArray =
      Value.projectHours &&
      Value.projectHours.map((hour: any) => ({
        projectId: hour.projectId,
        billingHours: hour.billingHours,
        employeeDelightHours: hour.employeeDelightHours,
      }));

    // Create an array of employee hours with employeeDelightHours
    // const employeeHoursArray = Value.delightHours && Value.delightHours.map((hour: any) => ({
    //     employeeDelightHours: hour.employeeDelightHours,
    //     projectId: hour.projectId,
    // }));

    const data = {
      employeeId: Value.employeeId,
      eodDate: Value.eodDate,
      // ? dayjs(Value.eodDate).toISOString()
      // : null,
      // unbilledHours: Value.unbilledHours,
      projectHours: projectHoursArray, // Use the modified arrays
      //employeeHours: employeeHoursArray,    // Use the modified arrays
      remarks: Value.remarks,
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

    const projectHoursArray =
      value.billingHours &&
      value.billingHours.map((hour: any) => ({
        projectId: hour.projectId,
        billingHours: hour.billingHours,
        employeeDelightHours: hour.employeeDelightHours,
      }));

    const data = {
      employeeId: value.employeeId,
      eodDate: value.eodDate,
      // ? dayjs(Value.eodDate).toISOString()
      // : null,
      // unbilledHours: Value.unbilledHours,
      projectHours: projectHoursArray, // Use the modified arrays
      //employeeHours: employeeHoursArray,    // Use the modified arrays
      remarks: value.remarks,
    };

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

  fetchEodById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/EodReport/getEodReportById/${id}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };
}

const eodReportService = new EodReportService();

export default eodReportService;