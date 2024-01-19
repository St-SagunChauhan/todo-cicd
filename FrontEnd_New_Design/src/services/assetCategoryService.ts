import axios from "axios";
import { Dispatch } from "react";
import authService from "./authServices";
import { IAssetCategoryActionTypes } from "../models/IAssetCategoryState";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class AssetCategoryService {
  fetchAssetCategoriesList = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IAssetCategoryActionTypes.AssetCategory_REQUEST,
    });
    axios
      .get(`${baseURL}/AssetCategory/getAllAssetsCategories`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IAssetCategoryActionTypes.AssetCategory_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IAssetCategoryActionTypes.AssetCategory_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchAssetCategoryById = (Id?: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = axios
      .get(`${baseURL}/AssetCategory/getAssetCategoryById/${Id}`, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });
    return response;
  };

  addAssetCategory = async (value: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const data = {
      categoryId: value.categoryId,
      categoryName: value.categoryName,
    };
    const response = await axios
      .post(`${baseURL}/AssetCategory/createAssetCategory`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateAssetCategory = async (value: any) => {
    const data = {
      categoryId: value.categoryId,
      categoryName: value.categoryName,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/AssetCategory/updateAssetCategory`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteAssetCategory = async (categoryID: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .delete(
        `${baseURL}/AssetCategory/deleteAssetCategory/Id?Id=${categoryID}`,
        { headers }
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const assetCategory = new AssetCategoryService();

export default assetCategory;
