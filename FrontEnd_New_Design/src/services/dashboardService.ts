import axios from 'axios';

import { Dispatch } from 'redux';
import authService from './authServices';
import { IDashboardLeadsConnectActionTypes } from '../models/IDashboardState';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
    Authorization: `Bearer ${authService.getAccessToken()}`,
};

class DashBoardService {
    fetchDashBoardList = () => (dispatch: Dispatch<any>) => {
        dispatch({
            type: IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_REQUEST,
        });

        axios
            .get(`${baseURL}/Dashboard/getDashboardData`, { headers })
            .then((response) => {
                dispatch({
                    type: IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_SUCCESS,
                    payload: { data: response.data, msg: response.data.message },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_FAILURE,
                    payload: { msg: error },
                });
            });
    };
}

const dashService = new DashBoardService();

export default dashService;
// function dispatch(arg0: { type: IEmpActionType; payload: { data: null } }) {
//   throw new Error('Function not implemented.');
// }
