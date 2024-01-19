import axios from 'axios';
import { Dispatch } from 'redux';
import { IProjectHealthActionTypes } from 'models/IProjectHealthState';
import authService from './authService';
import empService from './emp.Request';
import projectService from './project.Requets';
import { IProjectHealth } from '../features/ProjectHealth/ProjectHealthModel';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class ProjectHealthService {
  fetchProjectHealthList = (dept?: string | null) => (dispatch: Dispatch<any>) => {
    // Get department list
    dispatch(projectService.fetchProjectList());
    dispatch({
      type: IProjectHealthActionTypes.PROJECTHEALTH_REQUEST,
    });

    dispatch(empService.fetchEmpList());
    dispatch(projectService.fetchProjectList());

    axios
      .post(
        `${baseURL}/ProjectHealth/getAllProjectHealthDetails`,
        {
          departmentId: dept ?? null,
        },
        {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        },
      )
      .then((response) => {
        dispatch({
          type: IProjectHealthActionTypes.PROJECTHEALTH_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IProjectHealthActionTypes.PROJECTHEALTH_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchProjectHealthById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/ProjectHealth/getProjectHealthDetailsById/${id}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  addNewProjectHealth = async (value: IProjectHealth) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(`${baseURL}/ProjectHealth/createProjectHealthDetails`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteProjectHealth = async (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = await axios
      .delete(`${baseURL}/ProjectHealth/deleteProjectHealthDetails/${value}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateProjectHealth = async (value: IProjectHealth) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/ProjectHealth/updateProjectHealthDetails`, value, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const projectHealthService = new ProjectHealthService();

export default projectHealthService;
