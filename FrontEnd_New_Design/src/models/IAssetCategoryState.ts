export enum IAssetCategoryActionTypes {
    AssetCategory_REQUEST = "AssetCategory_REQUEST",
    AssetCategory_SUCCESS = "AssetCategory_SUCESS",
    AssetCategory_FAILURE = "AssetCategory_FAILURE",
}

export type IAssetCategoryState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IAssetCategoryActionCreator = {
    type: string;
    payload: IAssetCategoryState;
    loading: boolean;
};