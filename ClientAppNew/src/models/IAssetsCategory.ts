export enum IAssetsCategoryActionType {
  ASSETSCATEGORY_REQUEST = 'ASSETSCATAGORY/ASSETSCATEGORY_REQUEST',
  ASSETSCATEGORY_SUCCESS = 'ASSETSCATAGORY/ASSETSCATEGORY_SUCCESS',
  ASSETSCATEGORY_FAILURE = 'ASSETSCATAGORY/ASSETSCATEGORY_FAILURE',
}

export type IAssetsCategoryState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IAssetsCategoryActionCreator = {
  type: string;
  payload: IAssetsCategoryState;
  loading: boolean;
};
