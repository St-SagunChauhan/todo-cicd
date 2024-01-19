export enum IAssetsActionType {
  ASSETS_REQUEST = 'ASSETS/ASSETS_REQUEST',
  ASSETS_SUCCESS = 'ASSETS/ASSETS_SUCCESS',
  ASSETS_FAILURE = 'ASSETS/ASSETS_FAILURE',
}

export type IAssetsState = {
  data: any | null;
  msg?: string | null;
  loading?: boolean;
};

export type IAssetsActionCreator = {
  type: string;
  payload: IAssetsState;
};
