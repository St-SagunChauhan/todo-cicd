import axios from 'axios';
import { IAssetsCategoryActionType } from 'models/IAssetsCategory';
import { Dispatch } from 'redux';
import { IAssetAcategory } from 'features/Assets/AssetsCategories/AssetCategoryModel';
import authService from './authService';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class AssetCategoryService {
  fetchAssetCategoriesList = () => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IAssetsCategoryActionType.ASSETSCATEGORY_REQUEST,
    });
    await axios
      .get(`${baseURL}/AssetCategory/getAllAssetsCategories`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IAssetsCategoryActionType.ASSETSCATEGORY_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IAssetsCategoryActionType.ASSETSCATEGORY_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchAssetCategoryById = async (Id: string) => {
    const response = await axios
      .get(`${baseURL}/AssetCategory/getAssetCategoryById/${Id}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => response)
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
      .delete(`${baseURL}/AssetCategory/deleteAssetCategory/Id?Id=${categoryID}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const assetCategory = new AssetCategoryService();

export default assetCategory;
