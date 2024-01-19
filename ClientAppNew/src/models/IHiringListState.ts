export enum IHiringListActionType {
  HIRING_LIST_REQUEST = 'HIRING_LIST_REQUEST',
  HIRING_LIST_REQUEST_SUCCESS = 'HIRING_LIST_REQUEST_SUCCESS',
  HIRING_LIST_REQUEST_FAILURE = 'HIRING_LIST_REQUEST_FAILURE',
}

export type IHiringListState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IHiringListActionCreator = {
  type: string;
  payload: IHiringListState;
  loading: boolean;
};
