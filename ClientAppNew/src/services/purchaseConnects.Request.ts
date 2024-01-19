import axios from 'axios';
import { IPurchaseConnectsActionType } from 'models/IPurchaseConnects';
import { Dispatch } from 'redux';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class PurchaseReportServices {
  fetchPurchaseReportList = (createdDate?: string | null, endDate?: string | null) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IPurchaseConnectsActionType.Purchase_REQUEST,
    });

    axios
      .post(
        `${baseURL}/Connect/GetAllConnectHistoryReport`,
        {
          createdDate: createdDate ?? null,
          endDate: endDate ?? null,
        },
        {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        },
      )
      .then((response) => {
        dispatch({
          type: IPurchaseConnectsActionType.Purchase_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IPurchaseConnectsActionType.Purchase_FAILURE,
          payload: { msg: error, data: error.data },
        });
      });
  };

  createpurchaseReport = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const data = new FormData();
    data.append('file', file[0]);
    const response = await axios
      .post(`${baseURL}/Connect/UploadConnectHistoryExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  fetchFiltredDataPurchase = (dept?: string | null, startDate?: string | null) => async (dispatch: Dispatch<any>) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    dispatch({
      type: IPurchaseConnectsActionType.Purchase_REQUEST,
      payload: { data: null },
    });

    axios
      .post(
        `${baseURL}/Connect/GetAllConnectHistoryReport`,
        {
          departmentId: dept ?? null,
          startDate: startDate ?? null,
        },
        { headers },
      )
      .then((response) => {
        dispatch({
          type: IPurchaseConnectsActionType.Purchase_SUCCESS,
          payload: { data: response.data, msg: response.data.message },
        });
      })
      .catch((error) => {
        dispatch({
          type: IPurchaseConnectsActionType.Purchase_FAILURE,
          payload: { msg: error },
        });
      });
  };
}
const purchaseReportServices = new PurchaseReportServices();

export default purchaseReportServices;
