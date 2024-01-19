import axios from 'axios';
import { Dispatch } from 'redux';
import { ILeaveActionTypes } from '../models/ILeaveState';
import authService from './authServices';
import empService from './empRequest';
//import { ILeave } from '../features/Leave/LeaveModel';
import deptService from './deptRequest';
import { ILeave } from '../features/Leave/LeaveModel';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class LeaveService {
    fetchLeaveList =
        (endDate?: string | null, startDate?: string | null, dept?: string | null, emp?: string | null) =>
            (dispatch: Dispatch<any>) => {
                dispatch(deptService.fetchDepartmentList());
                dispatch(empService.fetchEmpList(dept));
                dispatch({
                    type: ILeaveActionTypes.Leave_REQUEST,
                });

                axios
                    .post(
                        `${baseURL}/Leaves/getAllLeaves`,
                        {
                            startDate: startDate ?? null,
                            endDate: endDate ?? null,
                            departmentId: dept ?? null,
                            employeeId: emp ?? null,
                        },
                        {
                            headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
                        },
                    )
                    .then((response) => {
                        dispatch({
                            type: ILeaveActionTypes.Leave_SUCCESS,
                            payload: { data: response.data },
                        });
                    })
                    .catch((error) => {
                        dispatch({
                            type: ILeaveActionTypes.Leave_FAILURE,
                            payload: { msg: error },
                        });
                    });
            };

    fetchLeaveById = async (id: string) => {
        const response = await axios
            .get(`${baseURL}/Leaves/getLeaveById/${id}`, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    addNewLeave = async (value: ILeave) => {
        value.endDate = value.endDate == '' ? null : value.endDate;
        const headers = {
            Authorization: `Bearer ${authService.getAccessToken()}`,
        };

        const response = await axios
            .post(`${baseURL}/Leaves/createLeave`, value, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    deleteLeave = async (id: string) => {
        const headers = {
            Authorization: `Bearer ${authService.getAccessToken()}`,
        };

        const response = await axios
            .delete(`${baseURL}/Leaves/deleteLeave/${id}`, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    updateLeave = async (value: any) => {
        value.endDate = value.endDate == '' ? null : value.endDate;
        const headers = {
            Authorization: `Bearer ${authService.getAccessToken()}`,
        };

        const response = await axios
            .put(`${baseURL}/Leaves/updateLeave`, value, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };
}

const leaveService = new LeaveService();

export default leaveService;
