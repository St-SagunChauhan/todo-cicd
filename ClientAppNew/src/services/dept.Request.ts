import axios from 'axios';
import { Dispatch } from 'redux';
import { IDeptActionTypes } from 'models/IDeptState';
import authService from './authService';
import { IDept, IDeptResponse } from '../features/Department/DeptModel';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class DeptService {
  fetchDepartmentList = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IDeptActionTypes.DEPARTMENT_REQUEST,
    });

    axios
      .get(`${baseURL}/Department/getAllDepartments`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IDeptActionTypes.DEPARTMENT_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IDeptActionTypes.DEPARTMENT_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchDepartmentById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/Department/getDepartmentById/${id}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  addNewDept = async (value: IDept): Promise<IDeptResponse> => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(`${baseURL}/Department/createDepartment`, { departmentName: value.departmentName, isActive: true }, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteDept = async (deptID: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .delete(`${baseURL}/Department/${deptID}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateDepartment = async (value: IDept) => {
    const data = {
      departmentName: value.departmentName,
      // status: value.status ? 1 : 0,
      departmentId: value.departmentId,
      isActive: true,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(`${baseURL}/Department/createDepartment`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const deptService = new DeptService();

export default deptService;
