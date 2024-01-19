export enum IConnectHistoryActionType {
    CONNECT_HISTORY_REQUEST = 'CONNECT_HISTORY_REQUEST',
    CONNECT_HISTORY_REQUEST_SUCCESS = 'CONNECT_HISTORY_REQUEST_SUCCESS',
    CONNECT_HISTORY_REQUEST_FAILURE = 'CONNECT_HISTORY_REQUEST_FAILURE',
  }
  
  export type IConnectHistoryState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
  };
  
  export type IConnectHistoryActionCreator = {
    type: string;
    payload: IConnectHistoryState;
    loading: boolean;
  };
  