import axios from 'axios';
import { IDashBoardActionType } from 'models/IDashBoardState';
import { Dispatch } from 'redux';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
  Authorization: `Bearer ${authService.getAccessToken()}`,
};

class DashBoardService {
  fetchDashBoardList = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IDashBoardActionType.DashBoard_REQUEST,
    });

    axios
      .get(`${baseURL}/Dashboard/getDashboardData`, { headers })
      .then((response) => {
        dispatch({
          type: IDashBoardActionType.DashBoard_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IDashBoardActionType.DashBoard_FAILURE,
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
