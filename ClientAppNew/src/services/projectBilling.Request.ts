import axios, { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { IProjectBillingActionTypes, IProjectBillingAddEditModel } from 'features/ProjectBilling/ProjectBillingModel';
import saveAs from 'file-saver';
import authService from './authService';
import projectService from './project.Requets';
import ProjectDepartmentService from './projectDept';
import marketPlaceAccountService from './marketPlaceAccount.Request';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class ProjectBillingService {
  fetchProjectBillingList =
    (endDate?: string | null, startDate?: string | null, dept?: string | null) => (dispatch: Dispatch<any>) => {
      // Get department list
      dispatch(projectService.fetchProjectList());
      dispatch(marketPlaceAccountService.fetchMarketPlaceAccountList());
      dispatch(ProjectDepartmentService.fetchProjectBillingList());

      dispatch({
        type: IProjectBillingActionTypes.PROJECT_BILLING_REQUEST,
      });

      axios
        .post(
          `${baseURL}/ProjectBilling/getProjectBillingDetails`,
          {
            departmentId: dept ?? null,
            startDate: startDate ?? null,
            endDate: endDate ?? null,
          },
          {
            headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
          },
        )
        .then((response) => {
          dispatch({
            type: IProjectBillingActionTypes.PROJECT_BILLING_SUCCESS,
            payload: { data: response.data },
          });
        })
        .catch((error) => {
          dispatch({
            type: IProjectBillingActionTypes.PROJECT_BILLING_FAILURE,
            payload: { msg: error },
          });
        });
    };

  addNewProjectBilling = async (value: IProjectBillingAddEditModel) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    value.startDate = `${value.startDate}T00:00:00.000Z`;
    value.endDate = `${value.endDate}T00:00:00.000Z`;

    const response = await axios
      .post(`${baseURL}/ProjectBilling/createProjectBillingDetails`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteProjectBilling = async (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = await axios
      .delete(`${baseURL}/ProjectBilling/${value}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateProjectBilling = async (value: IProjectBillingAddEditModel) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    value.startDate = `${value.startDate}T00:00:00.000Z`;
    value.endDate = `${value.endDate}T00:00:00.000Z`;
    const response = await axios
      .put(`${baseURL}/ProjectBilling/updateProjectBillingDetails`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  ImportProjectBilling = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/ProjectBilling/UploadProjectBillingExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  exportProjectbilling = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/ProjectBilling/DownloadProjectBilling',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'ProjectBilling.xlsx');
    });
  };
}

const projectBillingService = new ProjectBillingService();

export default projectBillingService;
