import axios from "axios";
import { IReportActionType } from "../models/IReportState";
import { Dispatch } from "redux";
import authService from "./authServices";
import { IContractStatusActionTypes } from "../models/IContractStatusState";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class ReportService {
  fetchReports =
    (dept?: string | null, contractStatus?: string | null, startDate?: string | null, endDate?: string | null) =>
      async (dispatch: Dispatch<any>) => {
        dispatch({
          type: IReportActionType.REPORT_REQUEST,
          payload: { data: null },
        });
        if (dept === "All") {
          dept = null;
        }
        if (contractStatus === "All") {
          contractStatus = null;
        }
        axios
          .post(
            `${baseURL}/report/projectReport`,
            {
              departmentId: dept ?? null,
              contractStatus: contractStatus ?? null,
              startDate: startDate ?? null,
              endDate: endDate ?? null
            },
            { headers }
          )
          .then((response) => {
            dispatch({
              type: IReportActionType.REPORT_SUCCESS,
              payload: { data: response.data, msg: response.data.message },
            });
          })
          .catch((error) => {
            dispatch({
              type: IReportActionType.REPORT_FAILURE,
              payload: { msg: error },
            });
          });
      };

  fetchClientReports =
    (dept?: string | null, contractStatus?: string | null) =>
      async (dispatch: Dispatch<any>) => {
        dispatch({
          type: IReportActionType.REPORT_REQUEST,
          payload: { data: null },
        });
        if (dept === "All") {
          dept = null;
        }
        if (contractStatus === "All") {
          contractStatus = null;
        }
        axios
          .post(
            `${baseURL}/report/clientReport`,
            {
              departmentId: dept ?? null,
              contractStatus: contractStatus ?? null,
            },
            { headers }
          )
          .then((response) => {
            dispatch({
              type: IReportActionType.REPORT_SUCCESS,
              payload: { data: response.data, msg: response.data.message },
            });
          })
          .catch((error) => {
            dispatch({
              type: IReportActionType.REPORT_FAILURE,
              payload: { msg: error },
            });
          });
      };

  fetchContractStatus = () => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IContractStatusActionTypes.ContractStatus_REQUEST,
    });

    axios
      .get(`${baseURL}/Report/getContractStatus`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IContractStatusActionTypes.ContractStatus_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IContractStatusActionTypes.ContractStatus_FAILURE,
          payload: { msg: error },
        });
      });
  };
}

const reportService = new ReportService();

export default reportService;
