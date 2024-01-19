import axios from 'axios';
import { Dispatch } from 'redux';
import { IProjectDepartmentActionTypes } from '../models/IProjectDeptState';
import authService from './authServices';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class ProjectDeptService {
    fetchProjectBillingList = () => (dispatch: Dispatch<any>) => {
        dispatch({
            type: IProjectDepartmentActionTypes.PROJECT_DEPARTMENT_REQUEST,
        });

        axios
            .get(`${baseURL}/Project/getProjectDepartments`, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => {
                dispatch({
                    type: IProjectDepartmentActionTypes.PROJECT_DEPARTMENT_SUCESS,
                    payload: { data: response.data },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IProjectDepartmentActionTypes.PROJECT_DEPARTMENT_FAILURE,
                    payload: { msg: error },
                });
            });
    };
}

const ProjectDepartmentService = new ProjectDeptService();

export default ProjectDepartmentService;
