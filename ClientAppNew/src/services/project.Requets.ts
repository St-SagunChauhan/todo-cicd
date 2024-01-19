import axios, { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { IProjectActionTypes } from 'models/IProjectState';
import { ProjectStatusEnum } from 'Enums/ProjectEnum/ProjectEnum';
import saveAs from 'file-saver';
import authService from './authService';
import { IProject } from '../features/Project/ProjectModal';
import deptService from './dept.Request';
import clientService from './clientRequest';
import empService from './emp.Request';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class ProjectService {
  fetchProjectList =
    (
      dept?: string | null,
      startDate?: string | null,
      projectStatus?: string | null,
      isActive?: boolean | null,
      contractType?: string | null,
    ) =>
    (dispatch: Dispatch<any>) => {
      // Get department list
      dispatch({
        type: IProjectActionTypes.PROJECT_REQUEST,
      });

      axios
        .post(
          `${baseURL}/Project/getAllProjects`,
          {
            departmentId: dept ?? null,
            startDate: startDate ?? null,
            projectStatus: projectStatus ?? null,
            isActive: isActive ?? null,
            contractType: contractType ?? null,
          },
          {
            headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
          },
        )
        .then((response) => {
          dispatch({
            type: IProjectActionTypes.PROJECT_SUCCESS,
            payload: { data: response.data },
          });
        })
        .catch((error) => {
          dispatch({
            type: IProjectActionTypes.PROJECT_FAILURE,
            payload: { msg: error },
          });
        });
    };

  addNewProject = async (value: IProject) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(
        `${baseURL}/Project/createProject`,
        {
          accounts: value.accounts,
          contractName: value.contractName,
          contractType: value.contractType,
          hoursPerWeek: value.hoursPerWeek,
          startDate: value.startDate ? `${value.startDate}T00:00:00.000Z` : null,
          endDate: value.endDate ? `${value.endDate}T00:00:00.000Z` : null,
          billingType: value.billingType,
          departmentIds: value.departmentId?.map((i: any) => i.value),
          clientId: value.clientId,
          projectUrl: value.projectUrl,
          projectReview: value.projectReview,
          status: ProjectStatusEnum.Active,
          rating: value.rating,
          employeeIds: value.employeeId?.map((i: any) => i.value),
          isActive: value.isActive,
          upworkName: value.upworkName,
          communicationMode: value.communicationMode,
          country: value.country,
          marketPlaceAccountId: value.marketPlaceAccountId,
          billingStatus: value.billingStatus,
          reason: value.reason,
        },
        { headers },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  getProject = (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = axios
      .get(`${baseURL}/Project/getProjectById/${value}`, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteProject = async (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = await axios
      .delete(`${baseURL}/Project/${value}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateProject = async (value: any) => {
    const data = {
      accounts: value.accounts,
      contractName: value.contractName,
      contractType: value.contractType,
      hoursPerWeek: value.hoursPerWeek,
      startDate: value.startDate,
      endDate: value.endDate,
      billingType: value.billingType,
      departmentIds: value.departmentId.map((i: any) => i.value),
      clientId: value.clientId,
      projectUrl: value.projectUrl,
      projectReview: value.projectReview === '' ? null : value.projectReview,
      status: value.status,
      projectId: value.projectId,
      rating: value.rating,
      employeeIds: value.employeeId === '' ? null : value.employeeId?.map((i: any) => i.value),
      isActive: value.isActive,
      communicationMode: value.communicationMode,
      country: value.country,
      marketPlaceAccountId: value.marketPlaceAccountId,
      billingStatus: value.billingStatus,
      reason: value.reason === '' ? null : value.reason,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/Project/updateProject`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
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

  exportProject = async () => {
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
      saveAs(url, 'Project.xlsx');
    });
  };
}

const projectService = new ProjectService();

export default projectService;
