import axios from 'axios';
//import { IEmployee } from 'features/Employee/EmpModel';
import { IEmpProjectActionType } from '../models/IEmpProjectState';
import { Dispatch } from 'redux';
import authService from './authServices';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class EmpProjectService {
    fetchEmpProjectList = () => (dispatch: Dispatch<any>) => {
        dispatch({
            type: IEmpProjectActionType.EmpProject_REQUEST,
            payload: { data: null },
        });

        axios
            .get(`${baseURL}/EmployeeProjects/getAllEmployeeProjects`, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => {
                dispatch({
                    type: IEmpProjectActionType.EmpProject_SUCCESS,
                    payload: { data: response.data, msg: response.data.message },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IEmpProjectActionType.EmpProject_FAILURE,
                    payload: { msg: error },
                });
            });
    };

    createEmployee = async (emp: any) => {
        const response = await axios
            .post(`${baseURL}/Employee/CreateEmployee`, emp, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => response)
            .catch((error) => error);

        return response;
    };

    updateEmployee = async (emp: any) => {
        const response = await axios
            .put(`${baseURL}/Employee/UpdateEmployee`, emp, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => response)
            .catch((error) => error);

        return response;
    };

    deleteClient = async (id: string) => {
        const response = await axios
            .delete(`${baseURL}/Client/${id}`, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => response)
            .catch((error) => error);

        return response;
    };
}

const empProjectService = new EmpProjectService();

export default empProjectService;
