export enum IAssetActionTypes {
    Asset_REQUEST = "Asset_REQUEST",
    Asset_SUCCESS = "Asset_SUCESS",
    Asset_FAILURE = "Asset_FAILURE",
}

export type IAssetState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IAssetActionCreator = {
    type: string;
    payload: IAssetState;
    loading: boolean;
};