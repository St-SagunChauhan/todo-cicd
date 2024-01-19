import axios from 'axios';
import { IEmployee, IEmpResponse } from 'features/EmployeeSalary/EmpModel';
import { IEmpSalaryActionType } from 'models/IEmpSalaryState';
import { Dispatch } from 'redux';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class EmpSalaryService {
  fetchEmpSalaryList = (dept?: string | null, deptName?: string | null) => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IEmpSalaryActionType.EMP_Salary_REQUEST,
      payload: { data: null },
    });
    axios
      .post(
        `${baseURL}/EmployeeSalaries/getAllEmployeeSalaryDetails`,
        {
          departmentId: dept ?? null,
          departmentName: deptName ?? null,
        },
        {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        },
      )
      .then((response) => {
        dispatch({
          type: IEmpSalaryActionType.EMP_Salary_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IEmpSalaryActionType.EMP_Salary_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchEmpSalaryById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/EmployeeSalaries/getEmployeeSalaryById/${id}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  createEmployeeSalary = async (emp: IEmployee): Promise<IEmpResponse> => {
    const response = await axios
      .post(`${baseURL}/EmployeeSalaries/createEmployeeSalary`, emp, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateEmployeeSalary = async (emp: IEmployee) => {
    const response = await axios
      .put(`${baseURL}/EmployeeSalaries/updateEmployeeSalary`, emp, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteEmployeeSalary = async (id: string) => {
    const response = await axios
      .delete(`${baseURL}/EmployeeSalaries/${id}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const empSalaryService = new EmpSalaryService();

export default empSalaryService;
