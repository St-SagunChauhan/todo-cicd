import axios, { AxiosRequestConfig } from 'axios';
import { IHiringListActionType } from 'models/IHiringListState';
import { Dispatch } from 'redux';
import { saveAs } from 'file-saver';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class HiringListService {
  downloadProjectSampleExcel = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/HRExpense/DownloadHiringReport',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then(async (response) => {
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Hiring List Excel.xlsx');
    });
  };

  ImportHiringList = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/HRExpense/UploadHiringReport`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  exportHiringListReport = async () => {
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/HRExpense/exportProjectStatusReport',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Hiring List Report.xlsx');
    });
  };

  fetchHiringListReports = () => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IHiringListActionType.HIRING_LIST_REQUEST,
      payload: { data: null },
    });
    axios
      .get(`${baseURL}/HRExpense/getAllHiringRecords`, { headers })
      .then((response) => {
        dispatch({
          type: IHiringListActionType.HIRING_LIST_REQUEST_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IHiringListActionType.HIRING_LIST_REQUEST_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchHiringDepartmentReports = (deptName: string) => async (dispatch: Dispatch<any>) => {
    const response = await axios
      .get(`${baseURL}/HRExpense/getHiringRecordsbydepartment?departmentId=${deptName}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IHiringListActionType.HIRING_LIST_REQUEST_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IHiringListActionType.HIRING_LIST_REQUEST_FAILURE,
          payload: { msg: error },
        });
      });
  };
}
const hiringListService = new HiringListService();

export default hiringListService;
