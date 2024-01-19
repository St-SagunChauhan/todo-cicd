export enum IConnectActionTypes {
  CONNECT_REQUEST = 'CONNECT/CONNECT_REQUEST',
  CONNECT_SUCCESS = 'CONNECT/CONNECT_SUCESS',
  CONNECT_FAILURE = 'CONNECT/CONNECT_FAILURE',
}

export type IConnectState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IConnectActionCreator = {
  type: string;
  payload: IConnectState;
  loading: boolean;
};
