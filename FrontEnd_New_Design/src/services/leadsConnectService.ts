import axios from "axios";
import {
  IDashboardLeadsConnectActionTypes,
  ILeadsConnectActionTypes,
} from "../models/ILeadsConnectState";
import { Dispatch } from "redux";
import authService from "./authServices";
import { IBidReportActionTypes } from "../models/IBidReportState";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class leadsConnectService {
  fetchbidsList =
    (
      startDate?: string | null,
      endDate?: string | null,
      dept?: string | null,
      emp?: string | null
    ) =>
    (dispatch: Dispatch<any>) => {
      dispatch({
        type: ILeadsConnectActionTypes.Leads_Connect_REQUEST,
      });

      axios
        .post(
          `${baseURL}/Job/getAllJobs`,
          {
            startDate: startDate ?? null,
            endDate: endDate ?? null,
            departmentId: dept ?? null,
            employeeId: emp ?? null,
          },
          {
            headers: {
              Authorization: `Bearer ${authService.getAccessToken()}`,
            },
          }
        )
        .then((response) => {
          dispatch({
            type: ILeadsConnectActionTypes.Leads_Connect_SUCCESS,
            payload: { data: response.data },
          });
        })
        .catch((error) => {
          dispatch({
            type: ILeadsConnectActionTypes.Leads_Connect_FAILURE,
            payload: { msg: error },
          });
        });
    };

  //need to implement
  fetchBidById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/Job/getJobbyId/${id}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  fetchBidByDeptId = (id: string) => (dispatch: Dispatch<any>) => {
    axios
      .get(`${baseURL}/Job/getJobsByDepartmentId/${id}`, { headers })
      .then((response) => {
        dispatch({
          type: ILeadsConnectActionTypes.Leads_Connect_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: ILeadsConnectActionTypes.Leads_Connect_FAILURE,
          payload: { msg: error },
        });
      });
  };

  createBid = async (bidData: any) => {
    const response = await axios
      .post(`${baseURL}/Job/createJob`, bidData, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updatebidData = async (formData: any) => {
    const response = await axios
      .put(`${baseURL}/Job/updateJob`, formData, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deletebids = async (value: string) => {
    const response = await axios
      .delete(`${baseURL}/Job/${value}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  fetchjobscalculationslist = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_REQUEST,
    });

    axios
      .get(`${baseURL}/Job/getJobCalculations`, {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      })
      .then((response) => {
        console.log("response---", response);
        dispatch({
          type: IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_FAILURE,
          payload: { msg: error },
        });
      });
  };
}

const bidService = new leadsConnectService();

export default bidService;
