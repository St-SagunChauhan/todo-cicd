import axios from 'axios';
import { Dispatch } from 'redux';
import { IProjectBillingActionTypes } from '../models/IProjectBillingState';
import authService from './authServices';
import projectService from './projectRequest';
import ProjectDepartmentService from './projectDeptRequest';
import marketPlaceAccountService from './marketPlaceAccountRequest';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class ProjectBillingService {
    fetchProjectBillingList =
        (endDate?: string | null, startDate?: string | null, dept?: string | null) => (dispatch: Dispatch<any>) => {
            // Get department list

            dispatch({
                type: IProjectBillingActionTypes.ProjectBilling_REQUEST,
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
                        type: IProjectBillingActionTypes.ProjectBilling_SUCCESS,
                        payload: { data: response.data },
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: IProjectBillingActionTypes.ProjectBilling_FAILURE,
                        payload: { msg: error },
                    });
                });
        };

    addNewProjectBilling = async (value: any) => {
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

    updateProjectBilling = async (value: any) => {
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
}

const projectBillingService = new ProjectBillingService();

export default projectBillingService;
