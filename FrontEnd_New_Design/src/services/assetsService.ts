import axios, { AxiosRequestConfig } from "axios";
import { Dispatch } from "react";
import { IAssetActionTypes } from "../models/IAssetState";
//import saveAs from 'file-saver';
import authService from "./authServices";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class AssetsService {
  fetchAssetsList = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IAssetActionTypes.Asset_REQUEST,
    });
    axios
      .post(`${baseURL}/Assets/getAllAssets`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {

        dispatch({
          type: IAssetActionTypes.Asset_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IAssetActionTypes.Asset_FAILURE,
          payload: { msg: error },
        });
      });
  };

  getAssetById = (id?: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = axios
      .get(`${baseURL}/Assets/GetAssetById/${id}`, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateAsset = async (value: any) => {
    const data = {
      assetId: value.assetId,
      assetName: value.assetName,
      quantity: value.quantity,
      purchasedDate: value.purchasedDate,
      manufacturerName: value.manufacturerName,
      modelNumber: value.modelNumber,
      remarks: value.remarks,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/Assets/updateAsset`, data, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  addAsset = async (value: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const data = {
      assetId: value.assetId,
      categoryId: value.categoryId,
      assetName: value.assetName,
      manufacturerName: value.manufacturerName,
      purchasedDate: value.purchasedDate,
      quantity: value.quantity,
      modelNumber: value.modelNumber,
      assetStatus: value.assetStatus,
      remarks: value.remarks,
    };
    const response = await axios
      .post(`${baseURL}/Assets/addAsset`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  ImportAsset = async (file: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const data = new FormData();
    data.append("file", file[0]);

    const response = await axios
      .post(`${baseURL}/Assets/UploadExcel`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  // downloadAssetList = async () => {
  //     const headers = {
  //         Authorization: `Bearer ${authService.getAccessToken()}`,
  //     };
  //     const instance = axios.create({ baseURL });
  //     const options: AxiosRequestConfig = {
  //         url: '/Assets/assetListReport',
  //         method: 'post',
  //         responseType: 'blob',
  //         headers: headers,
  //     };
  //     return instance.request<any>(options).then((response) => {
  //         const url = window.URL.createObjectURL(new Blob([response.data]));
  //         saveAs(url, 'Asset List.xlsx');
  //     });
  // };
}

const assetsService = new AssetsService();

export default assetsService;
