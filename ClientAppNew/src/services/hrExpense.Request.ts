import axios from 'axios';
import { Dispatch } from 'redux';
import { IHRExpenseActionTypes } from 'models/IHrExpenseState';
import authService from './authService';
import leaveService from './leave.Request';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class HrExpenseService {
  fetchHRExpensesList = (expenseYear?: string | null) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IHRExpenseActionTypes.HRExpense_REQUEST,
    });
    dispatch(this.fetchHRExpensesList);

    axios
      .post(
        `${baseURL}/HRExpense/GetAllRecords`,
        {
          expenseYear: expenseYear ?? null,
        },
        {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        },
      )
      .then((response) => {
        dispatch({
          type: IHRExpenseActionTypes.HRExpense_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IHRExpenseActionTypes.HRExpense_FAILURE,
          payload: { msg: error, data: error.data },
        });
      });
  };

  createHrExpensesReport = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/HRExpense/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}
const hRExpenseServices = new HrExpenseService();

export default hRExpenseServices;
