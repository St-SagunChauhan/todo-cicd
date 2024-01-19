import axios, { AxiosRequestConfig } from 'axios';
import { ITeamLoggerActionTypes } from 'models/ITeamLogger';
import { saveAs } from 'file-saver';
import { Dispatch } from 'redux';
import authService from './authService';
import deptService from './dept.Request';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class TeamLoggerServices {
  fetchFiltredData = (dept?: string | null, startDate?: string | null) => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ITeamLoggerActionTypes.TeamLogger_REQUEST,
      payload: { data: null },
    });

    axios
      .post(
        `${baseURL}/TeamLoggerReport/GetAllRecords`,
        {
          departmentId: dept ?? null,
          recordDate: startDate == '' ? null : startDate,
        },
        { headers },
      )
      .then((response) => {
        dispatch({
          type: ITeamLoggerActionTypes.TeamLogger_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: ITeamLoggerActionTypes.TeamLogger_FAILURE,
          payload: { msg: error },
        });
      });
  };

  createTeamLoggerReport = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/TeamLoggerReport/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  exportTeamlogger = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/TeamLoggerReport/downloadTeamloggerExcel',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Teamlogger Report.xlsx');
    });
  };

  downloadTeamloggerSampleExcel = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/TeamLoggerReport/downloadTeamloggerSampleExcel',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Teamlogger Sample Excel.xlsx');
    });
  };
}
const teamLoggerServices = new TeamLoggerServices();

export default teamLoggerServices;
