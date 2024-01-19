export enum IDashBoardActionType {
  DashBoard_REQUEST = 'DashBoard_REQUEST',
  DashBoard_SUCCESS = 'DashBoard_SUCCESS',
  DashBoard_FAILURE = 'DashBoard_FAILURE',
}

export type IDashBoardState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IDashBoardActionCreator = {
  type: string;
  payload: IDashBoardState;
  loading: boolean;
};
