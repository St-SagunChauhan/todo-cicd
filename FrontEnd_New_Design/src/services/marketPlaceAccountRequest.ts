import axios from "axios";
import { Dispatch } from "redux";
import { IMarketPlaceAccountActionTypes } from "../models/IMarketPlaceAccountState";
import authService from "./authServices";
//import { IMarketPlaceAccount } from '../features/MarketPlaceAccount/MarketPlaceAccountModal';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class MarketPlaceAccountService {
  fetchMarketPlaceAccountList = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IMarketPlaceAccountActionTypes.MarketPlaceAccount_REQUEST,
    });

    axios
      .get(`${baseURL}/MarketPlaceAccount/getAllMarketPlaceAccounts`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      })
      .then((response) => {
        dispatch({
          type: IMarketPlaceAccountActionTypes.MarketPlaceAccount_SUCCESS,
          payload: { data: response.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: IMarketPlaceAccountActionTypes.MarketPlaceAccount_FAILURE,
          payload: { msg: error },
        });
      });
  };

  fetchMarketPlaceAccountById = (value: string) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };
    const response = axios
      .get(`${baseURL}/MarketPlaceAccount/getMarketPlaceAccountById/${value}`, {
        headers,
      })
      .then((response) => response.data)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  addNewMarketPlaceAccount = async (value: any) => {
    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .post(
        `${baseURL}/MarketPlaceAccount/createMarketPlaceAccount`,
        {
          id: value.id,
          name: value.name,
          technology: value.technology,
          accounts: value.accounts,
          jobSuccessrate: value.jobSuccessrate,
          earning: value.earning,
          remarks: value.remarks,
          isActive: value.isActive,
          marketPlaceAccountsStatus: value.marketPlaceAccountsStatus,
          status: value.status,
        },
        { headers }
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
      id: value.id,
      name: value.name,
      technology: value.technology,
      accounts: value.accounts,
      jobSuccessRate: value.jobSuccessRate,
      earning: value.earning,
      remarks: value.remarks,
      isActive: value.isActive,
      marketPlaceAccountsStatus: value.marketPlaceAccountsStatus,
      status: value.status,
    };

    const headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    };

    const response = await axios
      .put(`${baseURL}/MarketPlaceAccount/updateMarketPlaceAccount`, data, {
        headers,
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };
}

const marketPlaceAccountService = new MarketPlaceAccountService();

export default marketPlaceAccountService;
