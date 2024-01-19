import axios, { AxiosRequestConfig } from 'axios';
//import { IClients } from 'features/Client/ClientModel';
import { IClientActionTypes } from '../models/IClientState';
import { Dispatch } from 'redux';
//import saveAs from 'file-saver';
import marketPlaceAccountService from './marketPlaceAccountRequest';
import authService from './authServices';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
const headers = {
    Authorization: `Bearer ${authService.getAccessToken()}`,
};

class ClientService {
    fetchClientList = (dept?: string | null) => (dispatch: Dispatch<any>) => {
        // Get department list
        dispatch({
            type: IClientActionTypes.Client_REQUEST,
            payload: { data: null },
        });

        axios
            .post(
                `${baseURL}/Client/getAllClients`,
                {
                    departmentId: dept ?? null,
                },
                { headers },
            )
            .then((response) => {
                dispatch({
                    type: IClientActionTypes.Client_SUCCESS,
                    payload: { data: response.data, msg: response.data.message },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IClientActionTypes.Client_FAILURE,
                    payload: { msg: error },
                });
            });
    };

    fetchClientListByDept = (dept?: any[] | null) => (dispatch: Dispatch<any>) => {
        // Get department list
        dispatch(marketPlaceAccountService.fetchMarketPlaceAccountList());
        dispatch({
            type: IClientActionTypes.Client_REQUEST,
            payload: { data: null },
        });

        axios
            .post(
                `${baseURL}/Client/GetClienForDepartment`,
                {
                    departmentIds: dept ?? null,
                },
                { headers },
            )
            .then((response) => {
                dispatch({
                    type: IClientActionTypes.Client_SUCCESS,
                    payload: { data: response.data, msg: response.data.message },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IClientActionTypes.Client_FAILURE,
                    payload: { msg: error },
                });
            });
    };

    fetchClientById = async (id: string) => {
        const response = await axios
            .get(`${baseURL}/Client/getClientById/${id}`, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    createClient = async (client: any) => {
        const response = await axios
            .post(`${baseURL}/Client/createClient`, client, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    updateClient = async (formData: any) => {
        const response = await axios
            .put(`${baseURL}/Client/updateClient`, formData, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    deleteClient = async (value: string) => {
        const response = await axios
            .delete(`${baseURL}/Client/${value}`, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    fetchClientsByStatus = (isStatus?: any) => (dispatch: Dispatch<any>) => {
        axios
            .get(`${baseURL}/Client/getClientsByStatus/${isStatus}`, {
                headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            })
            .then((response) => {
                dispatch({
                    type: IClientActionTypes.Client_SUCCESS,
                    payload: { data: response.data, msg: response.data.message },
                });
            })
            .catch((error) => {
                dispatch({
                    type: IClientActionTypes.Client_FAILURE,
                    payload: { msg: error },
                });
            });
    };

    ImportClient = async (file: any) => {
        const headers = {
            Authorization: `Bearer ${authService.getAccessToken()}`,
        };

        const data = new FormData();
        data.append('file', file[0]);

        const response = await axios
            .post(`${baseURL}/Client/UploadExcel`, data, { headers })
            .then((response) => response)
            .catch((error) => {
                return error.response;
            });

        return response;
    };

    // downloadClientsSampleExcel = async () => {
    //     const headers = {
    //         Authorization: `Bearer ${authService.getAccessToken()}`,
    //     };
    //     const instance = axios.create({ baseURL });
    //     const options: AxiosRequestConfig = {
    //         url: '/Client/downloadClientSampleExcel',
    //         method: 'post',
    //         responseType: 'blob',
    //         headers: headers,
    //     };
    //     return instance.request<any>(options).then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         saveAs(url, 'Clients Excel.xlsx');
    //     });
    // };
}

const clientService = new ClientService();

export default clientService;
