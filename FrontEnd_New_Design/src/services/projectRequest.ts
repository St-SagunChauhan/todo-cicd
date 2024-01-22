import axios from "axios";
import { Dispatch } from "redux";
import { IProjectActionTypes } from "../models/IProjectState";
import authService from "./authServices";
import dayjs from "dayjs";
import { RoleEnum } from "../features/Employee/EmployeeModel";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class ProjectService {
  fetchProjectList =
    (
      dept?: string | null,
      startDate?: string | null,
      projectStatus?: string | null,
      isActive?: boolean | null,
      contractType?: string | null
    ) =>
    (dispatch: Dispatch<any>) => {
      // Get department list
      dispatch({
        type: IProjectActionTypes.PROJECT_REQUEST,
      });

      const userInfo: any = JSON.parse(authService.getUser());      
      if (userInfo.role === RoleEnum.Employee.name) {        
        axios
          .get(
            `${baseURL}/Project/getProjectByEmployeeId/${userInfo.employeeId}`,
            {
              headers: {
                Authorization: `Bearer ${authService.getAccessToken()}`,
              },
            }
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
      } else {
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
              headers: {
                Authorization: `Bearer ${authService.getAccessToken()}`,
              },
            }
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
      }
    };

  addNewProject = async (values: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(
        `${baseURL}/Project/createProjectForExistingClients`,
        values,
        { headers }
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  getProjectById = (projectId: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = axios
      .get(`${baseURL}/Project/getProjectById/${projectId}`, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  getProjectHIstory = (projectId: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = axios
      .get(`${baseURL}/Project/getProjectsHistoryByProjectId/${projectId}`, {
        headers,
      })
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

  updateProject = async (formData: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/Project/updateProject`, formData, { headers })
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
    data.append("file", file[0]);

    const response = await axios
      .post(`${baseURL}/Project/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  // exportProject = async () => {
  //     const headers = {
  //         Authorization: `Bearer ${authService.getAccessToken()}`,
  //     };
  //     const instance = axios.create({ baseURL });
  //     const options: AxiosRequestConfig = {
  //         url: '/Project/DownloadExcel',
  //         method: 'post',
  //         responseType: 'blob',
  //         headers: headers,
  //     };
  //     return instance.request<any>(options).then((response) => {
  //         const url = window.URL.createObjectURL(new Blob([response.data]));
  //         saveAs(url, 'Project.xlsx');
  //     });
  // };
}

const projectService = new ProjectService();

export default projectService;
