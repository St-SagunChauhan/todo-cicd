import saveAs from 'file-saver';
import axios, { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { IConnectActionTypes } from 'models/IConnectState';
import authService from './authService';
import empService from './emp.Request';
import marketPlaceAccountService from './marketPlaceAccount.Request';
import deptService from './dept.Request';
import { IConnect } from '../features/Connect/ConnectModel';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class ConnectService {
  fetchConnectList = (dept?: string | null) => (dispatch: Dispatch<any>) => {
    // Get department list
    dispatch({
      type: IConnectActionTypes.CONNECT_REQUEST,
    });

    axios
      .post(
        `${baseURL}/Connect/getAllConnects`,
        {
          departmentId: dept ?? null,
        },
        { headers },
      )
      .then((response) => {
        dispatch({
          type: IConnectActionTypes.CONNECT_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IConnectActionTypes.CONNECT_FAILURE,
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

  addNewConnect = async (value: IConnect) => {
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

  updateConnect = async (value: IConnect) => {
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
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/Connect/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  downloadConnectsSampleExcel = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/Connect/downloadConnectsSampleExcel',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Connects Excel.xlsx');
    });
  };
}

const connectService = new ConnectService();

export default connectService;
