import axios from 'axios';
import { ICapacityActionType } from 'models/ICapacityState';
import { Dispatch } from 'redux';
import authService from './authService';

class CapacityReportService {
  fetchCapacityReports =
    (week?: string, dept?: string | null, endDate?: string, startDate?: string) => async (dispatch: Dispatch<any>) => {
      dispatch({
        type: ICapacityActionType.CAPACITY_REQUEST,
        payload: { data: null },
      });
      axios
        .post(
          `${process.env.REACT_APP_ENDPOINT_URL}/report/capacityReport`,
          {
            week: week ?? null,
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
            type: ICapacityActionType.CAPACITY_REQUEST_SUCCESS,
            payload: { data: response.data, msg: response.data.message },
          });
        })
        .catch((error) => {
          dispatch({
            type: ICapacityActionType.CAPACITY_REQUEST_FAILURE,
            payload: { msg: error },
          });
        });
    };
}
const capacityReportService = new CapacityReportService();

export default capacityReportService;
