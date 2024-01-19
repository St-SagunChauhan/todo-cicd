import axios, { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { IAssetsHandoverActionType } from 'models/IAssetHandoveredState';
import { IHandoverAsset } from 'features/Assets/HandoverAssets/HandoverAssetModel';
import saveAs from 'file-saver';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class AssetsHandoverService {
  fetchAssetsHadnoverList =
    (
      assetName?: string | null,
      employeeName?: string | null,
      handoverStatus?: string | null,
      assingedDate?: string | null,
      dataRetreivalDate?: string | null,
    ) =>
      async (dispatch: Dispatch<any>) => {
        dispatch({
          type: IAssetsHandoverActionType.ASSETSHANDOVER_REQUEST,
        });
        await axios
          .post(
            `${baseURL}/HandoverAsset/getAllHandoverAssetsRecords`,
            {
              assetId: assetName ?? null,
              employeeId: employeeName ?? null,
              handoverStatus: handoverStatus ?? null, // Include handoverStatus in the request payload
              assignedDate: assingedDate ?? null,
              dataRetreivalDate: dataRetreivalDate ?? null,
            },
            {
              headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
            },
          )
          .then((response) => {
            dispatch({
              type: IAssetsHandoverActionType.ASSETSHANDOVER_SUCCESS,
              payload: { data: response.data },
            });
          })
          .catch((error) => {
            dispatch({
              type: IAssetsHandoverActionType.ASSETSHANDOVER_FAILURE,
              payload: { msg: error },
            });
          });
      };

  getHandoverAssetById = (id?: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = axios
      .get(`${baseURL}/HandoverAsset/getHandoverAssetResponseById/${id}`, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteHandoverAsset = async (id?: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = await axios
      .delete(`${baseURL}/HandoverAsset/deleteHandoverAssetResponse/${id}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateAssetHandoveredRecord = async (value: any) => {
    const data = {
      handoverId: value.handoverId,
      assetId: value.assetId,
      employeeId: value.employeeId,
      assignedDate: value.assignedDate,
      identificationNumber: value.identificationNumber,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/HandoverAsset/updateHandoverAssetRecord`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  handoverAsset = async (value: IHandoverAsset) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(
        `${baseURL}/HandoverAsset/AddHandoverAssetRecord`,
        {
          assetIds: value.assetId?.map((i: any) => i.value),
          employeeId: value.employeeId,
          assignedDate: value.assignedDate ? `${value.assignedDate}T00:00:00.000Z` : null,
          identificationNumber: value.identificationNumber,
        },
        { headers },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  ImportHandoverAsset = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append('file', file[0]);

    const response = await axios
      .post(`${baseURL}/HandoverAsset/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  downloadHandoverAssetList = async () => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const instance = axios.create({ baseURL });
    const options: AxiosRequestConfig = {
      url: '/HandoverAsset/downloadHandoverAssetReport',
      method: 'post',
      responseType: 'blob',
      headers: headers,
    };
    return instance.request<any>(options).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, 'Handover Asset List.xlsx');
    });
  };
}

const handoverassetsService = new AssetsHandoverService();

export default handoverassetsService;
