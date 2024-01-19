import axios, { AxiosRequestConfig } from 'axios';
import { IReportActionType } from 'models/IReportsState';
import { Dispatch } from 'redux';
import { saveAs } from 'file-saver';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class ReportService {
  fetchReports =
    (
      dept?: string | null,
      contractStatus?: string | null,
      country?: string | null,
      startDate?: string | null,
      endDate?: string | null,
    ) =>
    async (dispatch: Dispatch<any>) => {
      dispatch({
        type: IReportActionType.REPORT_REQUEST,
        payload: { data: null },
      });
      axios
        .post(
          `${baseURL}/report/projectReport`,
          {
            departmentId: dept ?? null,
            contractStatus: contractStatus ?? null,
            country: country ?? null,
            startDate: startDate ?? null,
            endDate: endDate ?? null,
          },
          { headers },
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

  exportProjectStatusReport = async () => {
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/report/exportProjectStatusReport',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Project Status Report.xlsx');
    });
  };

  ImportProject = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/Project/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  downloadProjectSampleExcel = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/Project/DownloadExcel',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Project Report Excel.xlsx');
    });
  };
}

const reportService = new ReportService();

export default reportService;
