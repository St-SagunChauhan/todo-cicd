import axios from 'axios';
import { Dispatch } from 'redux';
import { IMarketPlaceAccountActionTypes } from 'models/IMarketPlaceAccountState';
import authService from './authService';
import { IMarketPlaceAccount } from '../features/MarketPlaceAccount/MarketPlaceAccountModal';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class MarketPlaceAccountService {
  fetchMarketPlaceAccountList = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IMarketPlaceAccountActionTypes.MARKETPLACEACCOUNT_REQUEST,
    });

    axios
      .get(`${baseURL}/MarketPlaceAccount/getAllMarketPlaceAccounts`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IMarketPlaceAccountActionTypes.MARKETPLACEACCOUNT_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IMarketPlaceAccountActionTypes.MARKETPLACEACCOUNT_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchMarketPlaceAccountById = (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = axios
      .get(`${baseURL}/MarketPlaceAccount/getMarketPlaceAccountById/${value}`, { headers })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  addNewMarketPlaceAccount = async (value: IMarketPlaceAccount) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(
        `${baseURL}/MarketPlaceAccount/createMarketPlaceAccount`,
        {
          name: value.name,
          accounts: value.accounts,
          isActive: value.isActive,
        },
        { headers },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  deleteMarketPlaceAccount = async (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .delete(`${baseURL}/MarketPlaceAccount/${value}`, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  updateMarketPlaceAccount = async (value: any) => {
    const data = {
      name: value.name,
      address: value.address,
      password: value.password,
      accounts: value.accounts,
      id: value.id,
      isActive: value.isActive,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(`${baseURL}/MarketPlaceAccount/createMarketPlaceAccount`, data, { headers })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const marketPlaceAccountService = new MarketPlaceAccountService();

export default marketPlaceAccountService;
