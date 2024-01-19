import axios from 'axios';
import { IBidReportActionTypes, IBidReportState } from '../models/IBidReportState';
import { Dispatch } from 'redux';
import authService from './authServices';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class WeeklyJobReportService {
    fetchWeeklyJobReports = () => (dispatch: Dispatch<any>) => {
        dispatch({
            type: IBidReportActionTypes.Bid_Report_REQUEST,
        });

        axios
            .get(`${baseURL}/Report/weeklyJobReport`, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => {
                dispatch({
                    type: IBidReportActionTypes.Bid_Report_SUCCESS,
                    payload: { data: response.data },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IBidReportActionTypes.Bid_Report_FAILURE,
                    payload: { msg: error },
                });
            });
    };
}
const weeklyJobReportService = new WeeklyJobReportService();

export default weeklyJobReportService;
