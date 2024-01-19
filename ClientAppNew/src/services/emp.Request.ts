import axios, { AxiosRequestConfig } from 'axios';
import { IEmployee, IEmpResponse } from 'features/Employee/EmpModel';
import { IEmpActionType } from 'models/IEmpState';
import { Dispatch } from 'redux';
import { saveAs } from 'file-saver';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class EmpService {
  fetchEmpList = (dept?: string | null) => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IEmpActionType.EMP_REQUEST,
      payload: { data: null },
    });
    axios
      .post(
        `${baseURL}/Employee/GetEmployees`,
        {
          departmentId: dept ?? null,
        },
        { headers },
      )
      .then((response) => {
        dispatch({
          type: IEmpActionType.EMP_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IEmpActionType.EMP_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchEmpListByDept = (dept?: any[] | null) => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IEmpActionType.EMP_REQUEST,
      payload: { data: null },
    });
    axios
      .post(
        `${baseURL}/Employee/GetEmployeesForDepartment`,
        {
          departmentIds: dept ?? null,
        },
        { headers },
      )
      .then((response) => {
        dispatch({
          type: IEmpActionType.EMP_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IEmpActionType.EMP_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchEmpById = async (id: string) => {
    const response = await axios
      .get(`${baseURL}/Employee/getEmployee/${id}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  createEmployee = async (emp: IEmployee): Promise<IEmpResponse> => {
    if (emp.assignedTo === '') {
      emp.assignedTo = null;
    }
    if (emp.resignationDate === '') {
      emp.resignationDate = null;
    }
    const response = await axios
      .post(`${baseURL}/Employee/CreateEmployee`, emp, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateEmployee = async (emp: IEmployee): Promise<IEmpResponse> => {
    emp.assignedTo = emp.assignedTo ? emp.assignedTo : null;
    emp.resignationDate = emp.resignationDate ? emp.resignationDate : null;
    emp.employeeTargetedHours = emp.employeeTargetedHours ? emp.employeeTargetedHours : null;

    const response = await axios
      .put(`${baseURL}/Employee/UpdateEmployee`, emp, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteEmployee = async (id: string) => {
    const response = await axios
      .delete(`${process.env.REACT_APP_ENDPOINT_URL}/Employee/deleteEmployee/${id}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateProfilePicture = async (employeeId: string, profilePicture: string | null) => {
    const response = await axios
      .put(
        `${baseURL}/Employee/updateProfilePicture`,
        {
          employeeId: employeeId ?? null,
          profilePicture: profilePicture ?? null,
        },
        { headers },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  impersonateEmployee = async (ImpersonatedUserId: string, ImpersonatorId: string) => {
    const response = await axios
      .post(
        `${baseURL}/Employee/ImpersonateEmployee/`,
        {
          ImpersonatorId: ImpersonatorId,
          ImpersonatedUserId: ImpersonatedUserId,
        },
        { headers },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  stopImpersonation = async (ImpersonatedUserId: string, ImpersonatorId: string) => {
    const response = await axios
      .post(
        `${baseURL}/Employee/StopImpersonation/`,
        {
          ImpersonatorId: ImpersonatorId,
          ImpersonatedUserId: ImpersonatedUserId,
        },
        { headers },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  ImportEmployee = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/Employee/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  downloadEmployeeSampleExcel = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/Employee/DownloadEmployeeExcel',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Employee Excel.xlsx');
    });
  };
}

const empService = new EmpService();

export default empService;
// function dispatch(arg0: { type: IEmpActionType; payload: { data: null } }) {
//   throw new Error('Function not implemented.');
// }
