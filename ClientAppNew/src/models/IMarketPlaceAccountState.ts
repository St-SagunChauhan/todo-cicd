export enum IMarketPlaceAccountActionTypes {
  MARKETPLACEACCOUNT_REQUEST = 'MARKETPLACEACCOUNT/MARKETPLACEACCOUNT_REQUEST',
  MARKETPLACEACCOUNT_SUCCESS = 'MARKETPLACEACCOUNT/MARKETPLACEACCOUNT_SUCESS',
  MARKETPLACEACCOUNT_FAILURE = 'MARKETPLACEACCOUNT/MARKETPLACEACCOUNT_FAILURE',
}

export type IMarketPlaceAccountState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IMarketPlaceAccountActionCreator = {
  type: string;
  payload: IMarketPlaceAccountState;
  loading: boolean;
};
