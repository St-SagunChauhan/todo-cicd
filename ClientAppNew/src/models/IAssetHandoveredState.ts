export enum IAssetsHandoverActionType {
  ASSETSHANDOVER_REQUEST = 'ASSETSHANDOVER/ASSETSHANDOVER_REQUEST',
  ASSETSHANDOVER_SUCCESS = 'ASSETSHANDOVER/ASSETSHANDOVER_SUCCESS',
  ASSETSHANDOVER_FAILURE = 'ASSETSHANDOVER/ASSETSHANDOVER_FAILURE',
}

export type IAssetsHandoverState = {
  data: any | null;
  msg?: string | null;
  loading?: boolean;
};

export type IAssetsHandoverActionCreator = {
  type: string;
  payload: IAssetsHandoverState;
};
