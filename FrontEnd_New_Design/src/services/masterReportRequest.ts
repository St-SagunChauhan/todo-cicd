import axios, { AxiosRequestConfig } from 'axios';
import { IMasterReportActionType } from '../models/IMasterReportState';
import { Dispatch } from 'redux';
//import { saveAs } from 'file-saver';
import authService from './authServices';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
    Authorization: `Bearer ${authService.getAccessToken()}`,
};

class MasterReportService {
    fetchmasterbillingReport = (startDate?: string, currentDate?: string) => (dispatch: Dispatch<any>) => {
        dispatch({
            type: IMasterReportActionType.MasterReport_REQUEST,
            payload: { data: null },
        });

        axios
            .post(
                `${baseURL}/report/masterBillingReport`,
                {
                    startDate: startDate ?? null,
                    currentDate: currentDate ?? null,
                },
                { headers },
            )
            .then((response) => {
                dispatch({
                    type: IMasterReportActionType.MasterReport_SUCCESS,
                    payload: { data: response.data, msg: response.data.message },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IMasterReportActionType.MasterReport_FAILURE,
                    payload: { msg: error },
                });
            });
    };

    //   exportMasterReport = async () => {
    //     const instance = axios.create({ baseURL });
    //     const options: AxiosRequestConfig = {
    //       url: '/report/exportMasterReport',
    //       method: 'post',
    //       responseType: 'blob',
    //       headers: headers,
    //     };
    //     return instance.request<any>(options).then((response) => {
    //       const url = window.URL.createObjectURL(new Blob([response.data]));
    //       saveAs(url, 'Master Report.xlsx');
    //     });
    //   };
}
const masterReportService = new MasterReportService();

export default masterReportService;
