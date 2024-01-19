//import saveAs from 'file-saver';
import axios from "axios";
import { Dispatch } from "redux";
import { IConnectActionTypes } from "../models/IConnectState";
import authService from "./authServices";
import empService from "./empRequest";
import marketPlaceAccountService from "./marketPlaceAccountRequest";
import deptService from "./deptRequest";
import { IConnectsActionTypes } from "../models/IConnectsState";
import dayjs from "dayjs";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class ConnectService {
  fetchConnectList = (dept?: string | null) => (dispatch: Dispatch<any>) => {
    // Get department list
    dispatch(deptService.fetchDepartmentList());
    dispatch({
      type: IConnectActionTypes.Connect_REQUEST,
    });

    dispatch(empService.fetchEmpList());
    dispatch(deptService.fetchDepartmentList());
    dispatch(marketPlaceAccountService.fetchMarketPlaceAccountList());

    axios
      .post(
        `${baseURL}/Connect/getAllConnects`,
        {
          departmentId: dept ?? null,
        },
        { headers }
      )
      .then((response) => {
        dispatch({
          type: IConnectActionTypes.Connect_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IConnectActionTypes.Connect_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchConnectById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/Connect/getConnectById/${id}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  addNewConnect = async (value: any) => {
    const response = await axios
      .post(`${baseURL}/Connect/createConnect`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteConnect = async (value: any) => {
    const response = await axios
      .delete(`${baseURL}/Connect/${value.row.connectId}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateConnect = async (value: any) => {
    const response = await axios
      .put(`${baseURL}/Connect/updateConnect`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  createConnectReport = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append("file", file[0]);

    const response = await axios
      .post(`${baseURL}/Connect/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  // downloadConnectsSampleExcel = async () => {
  //     const headers = {
  //         Authorization: `Bearer ${authService.getAccessToken()}`,
  //     };
  //     const instance = axios.create({ baseURL });
  //     const options: AxiosRequestConfig = {
  //         url: '/Connect/downloadConnectsSampleExcel',
  //         method: 'post',
  //         responseType: 'blob',
  //         headers: headers,
  //     };
  //     return instance.request<any>(options).then((response) => {
  //         const url = window.URL.createObjectURL(new Blob([response.data]));
  //         saveAs(url, 'Connects Excel.xlsx');
  //     });
  // };

  fetchConnectsList = () => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IConnectsActionTypes.Connects_REQUEST,
    });

    await axios
      .get(`${baseURL}/Connect/getAllConnects`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IConnectsActionTypes.Connects_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IConnectsActionTypes.Connects_FAILURE,
          payload: { msg: error },
        });
      });
  };

  addNewConnects = async (value: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(
        `${baseURL}/Connect/createConnects`,
        {
          dateOfPurchase: value.dateOfPurchase
            ? dayjs(value.dateOfPurchase).toISOString()
            : null,
          numberOfConnects: value.numberOfConnects,
          accountType: value.accountType,
          amount: value.amount,
        },
        { headers }
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  importConnects = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append("file", file[0]);

    const response = await axios
      .post(`${baseURL}/Connect/uploadConnectsExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const connectService = new ConnectService();

export default connectService;
