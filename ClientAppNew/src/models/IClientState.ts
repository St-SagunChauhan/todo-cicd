export enum IClientActionType {
  CLIENT_REQUEST = 'Client_REQUEST',
  CLIENT_SUCCESS = 'Client_SUCCESS',
  CLIENT_FAILURE = 'Client_FAILURE',
}

export type IClientState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IClientActionCreator = {
  type: string;
  payload: IClientState;
  loading: boolean;
};
