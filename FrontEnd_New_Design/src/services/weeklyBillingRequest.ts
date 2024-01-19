import axios, { AxiosRequestConfig } from 'axios';
import { IWeeklyBillingActionType } from '../models/IWeeklyBillingState';
import { Dispatch } from 'redux';
//import { saveAs } from 'file-saver';
import authService from './authServices';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
    Authorization: `Bearer ${authService.getAccessToken()}`,
};

class WeeklyBillingService {
    fetchWeeklyBillingReports =
        (week?: string | null, dept?: string | null, endDate?: string | null, startDate?: string | null, depName?: string | null) =>
            async (dispatch: Dispatch<any>) => {
                dispatch({
                    type: IWeeklyBillingActionType.WEEKLY_BILLING_REQUEST,
                    payload: { data: null },
                });
                axios
                    .post(
                        `${baseURL}/report/billingReport`,
                        {
                            week: week ?? null,
                            departmentId: dept ?? null,
                            startDate: startDate ?? null,
                            endDate: endDate ?? null,
                            departmentName: depName ?? null,
                        },
                        { headers },
                    )
                    .then((response) => {
                        dispatch({
                            type: IWeeklyBillingActionType.WEEKLY_BILLING_REQUEST_SUCCESS,
                            payload: { data: response.data, msg: response.data.message },
                        });
                    })
                    .catch((error) => {
                        dispatch({
                            type: IWeeklyBillingActionType.WEEKLY_BILLING_REQUEST_FAILURE,
                            payload: { msg: error },
                        });
                    });
            };

    // exportWeeklyBillingReport = async (value: string) => {
    //     const instance = axios.create({ baseURL });
    //     const options: AxiosRequestConfig = {
    //         url: '/report/exportWeeklyBillingReport',
    //         method: 'post',
    //         responseType: 'blob',
    //         headers: headers,
    //         // data: { data: value },
    //     };
    //     return instance.request<any>(options).then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         saveAs(url, 'Weekly Billing Report.xlsx');
    //     });
    // };
}

const weeklyBillingService = new WeeklyBillingService();

export default weeklyBillingService;
