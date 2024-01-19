import axios from 'axios';
import { IWeeklyProjectActionType } from '../models/IWeeklyProjectState';
import { Dispatch } from 'redux';
import authService from './authServices';

class WeeklyProjectService {
    fetchWeeklyProjectReports =
        (dept?: string | null, week?: string, endDate?: string, startDate?: string) => async (dispatch: Dispatch<any>) => {
            dispatch({
                type: IWeeklyProjectActionType.WEEKLY_PROJECT_REQUEST,
                payload: { data: null },
            });

            axios
                .post(
                    `${process.env.REACT_APP_ENDPOINT_URL}/report/customProjectReport`,
                    {
                        departmentId: dept ?? null,
                        week: week ?? null,
                        startDate: startDate ?? null,
                        endDate: endDate ?? null,
                    },
                    {
                        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
                    },
                )
                .then((response) => {
                    dispatch({
                        type: IWeeklyProjectActionType.WEEKLY_PROJECT_REQUEST_SUCCESS,
                        payload: { data: response.data, msg: response.data.message },
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: IWeeklyProjectActionType.WEEKLY_PROJECT_REQUEST_FAILURE,
                        payload: { msg: error },
                    });
                });
        };
}
const weeklyProjectService = new WeeklyProjectService();

export default weeklyProjectService;
