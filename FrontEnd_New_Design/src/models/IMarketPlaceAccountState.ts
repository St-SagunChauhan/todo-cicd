export enum IMarketPlaceAccountActionTypes {
    MarketPlaceAccount_REQUEST = "MarketPlaceAccount_REQUEST",
    MarketPlaceAccount_SUCCESS = "MarketPlaceAccount_SUCESS",
    MarketPlaceAccount_FAILURE = "MarketPlaceAccount_FAILURE",
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